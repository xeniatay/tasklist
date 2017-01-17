import _ from 'underscore'
import uuidV1 from 'uuid/v1'
import Store from './store.js'

export default class Actions {
  /**
   * Create new task list
   * @param {number} Task id
   * @param {array} Children in task list, defaults to []
   * @return {object} Task list
   */
  static createList(id, children = []) {
    return {
      taskId: id,
      children: children
    }
  }

  /**
   * Create new task
   * @param {number} Parent task id
   * @param {number} (Optional) Task id, only used to create root task
   * @return {object} Task
   */
  static createTask(parentId, id = null) {
    return {
      // id: id || _.uniqueId(),
      id: id || uuidV1(),
      parentId: parentId,
      text: ''
    }
  }

  /**
   * Add a task to the 'tasks' data structure
   * @param {object} Task to be added
   * @return {void}
   */
  static addTask(newTask) {
    const tasks = Store.getData('tasks')
    tasks.push(newTask)
    Store.update('tasks', tasks)
  }

  /**
   * Insert a task into the document
   * Determine new task position based off the taskForAppend
   * @param {object} Task that triggered the insert event.
                     The new task will be inserted after this task.
   * @return {number} Id of new task
   */
  static insertTask(appendTo) {
    const newTask = this.createTask(appendTo.parentId)

    this.addTask(newTask)
    this.spliceToList(newTask, appendTo.id)

    return newTask.id
  }

  /**
   * Insert a new task into its parent's task list
   * Determine new task position based off the appendTo
   * @param {object} Task to be inserted
   * @param {object} Id of task that the new task will be inserted after
   * @return {void}
   */
  static updateTask(id, value) {
    const tasks = Store.getData('tasks')
    const index = _.findIndex(tasks, {
      id: id
    })

    tasks[index].text = value
    Store.update('tasks', tasks)
  }

  /**
   * Indent a task
   * i.e. {task} gets appended to the task list of its immediate previous sibling
   * If there is no previous sibling task, do nothing
   * @param {object} Task to be indented
   * @return {void}
   */
  static indentTask(task) {
    const oldListChildren = this.getListChildren(task.parentId)

    // There is no previous sibling task
    if (_.first(oldListChildren) === task.id) {
      // Do nothing
      // TODO: Potential enhancement - allow infinite indentation
    } else {
      const prevTaskIndex = this.getListIndexOf(task) - 1
      const newParentId = oldListChildren[prevTaskIndex]

      // Remove task from old list
      this.spliceFromList(task)

      // Update task to new parent id and insert it into new parent's list
      task = this.setParentId(task, newParentId)
      this.spliceToList(task)
    }
  }

  /**
   * Reverse indent a task
   * i.e. {task} becomes the direct next sibling of its original parent task
   * @param {object} Task to be reverse indented
   * @return {void}
   */
  static reverseIndentTask(task) {
    const parent = this.getTask(task.parentId)

    if (parent && task.parentId !== Store.rootId) {
      this.spliceFromList(task)
      task = this.setParentId(task, parent.parentId)
      this.spliceToList(task, parent.id, parent.parentId)
    }
  }

  /**
   * Return ID of the previous task in the visual hierarchy
   * @param {object} Current task
   * @return {number} ID of previous task
   */
  static getPrevTask(task) {
    const parentList = this.getListChildren(task.parentId)
    const prevIndex = parentList.indexOf(task.id) - 1
    let focusId = task.id

    if (prevIndex >= 0) {
      const prevTaskId = parentList[prevIndex]
      const prevList = this.getListChildren(prevTaskId)

      // Previous task has children, so we recurse through the children
      // to get the immediate previous visual sibling
      if (prevList.length) {
        focusId = this.getPrevVisualSibling(prevTaskId)

      // Previous task has no children
      } else {
        focusId = prevTaskId
      }

    // There is no previous task because current task is index === 0
    } else {
      focusId = task.parentId
    }

    return focusId
  }

  /**
   * Return ID of the previous visual sibling (aka leaf child)
   * @param {object} Current task id
   * @return {number} ID of previous visual sibling
   */
  static getPrevVisualSibling(id) {
    const list = this.getListChildren(id)
    const lastTask = _.last(list)

    // If current list has children, recurse until we find a task with no children
    if (lastTask) {
      return this.getPrevVisualSibling(lastTask)
    } else {
      return id
    }
  }

  /**
   * Return ID of the next task in the visual hierarchy
   * @param {object} Current task
   * @return {number} ID of next task
   */
  static getNextTask(task) {
    const list = this.getListChildren(task.id)
    let focusId = task.id

    // If a list of immediate children exists, get the first child
    if (list.length) {
      focusId = _.first(list)

    // Get the next task based off the parent list
    } else {
      const parentList = this.getListChildren(task.parentId)
      const isNotRoot = task.parentId !== Store.rootId

      // This is the last task in parentList, so we recurse through
      // the ancestor lists to find the next visual sibling
      if (_.last(parentList) === task.id && isNotRoot) {
        focusId = this.getNextVisualSibling(task)

      // Get the next sibling in the parentList
      } else {
        focusId = parentList[this.getListIndexOf(task) + 1]
      }
    }

    return focusId
  }

  /**
   * Return ID of the next visual sibling
   * We want to get the first child of the first immediate parent that has a list
   * @param {object} Current task id
   * @return {number} ID of next visual sibling
   */
  static getNextVisualSibling(task, prevTaskId) {
    if (task) {
      const list = this.getListChildren(task.id)
      const nextIndex = list.indexOf(prevTaskId) + 1

      // List contains a valid nextTask
      if (list.length && list.length > nextIndex) {
        return list[nextIndex]

      // Recurse through parent to look for a list with a valid next task
      } else {
        return this.getNextVisualSibling(this.getTask(task.parentId), task.id)
      }
    }
  }

  /**
   * Get task by id
   * @param {number} Task Id
   * @return {object} Task
   */
  static getTask(id) {
    const tasks = Store.getData('tasks')

    return _.findWhere(tasks, {
      id: id
    }) || null
  }

  /**
   * Set task parentId
   * @param {number} Task
   * @return {void}
   */
  static setParentId(task, parentId) {
    const tasks = Store.getData('tasks')
    const index = _.findIndex(tasks, {
      id: task.id
    })

    tasks[index].parentId = parentId
    Store.update('tasks', tasks)

    return tasks[index]
  }

  /**
   * Get index of task in a task list
   * @param {object} Task
   * @return {number} Index of task
   */
  static getListIndexOf(task) {
    const listChildren = this.getListChildren(task.parentId)

    return listChildren.indexOf(task.id)
  }

  /**
   * Get task list
   * @param {number} Task id
   * @return {array} Task list
   */
  static getListChildren(id) {
    const lists = Store.getData('lists')
    let list = _.findWhere(lists, {
      taskId: id
    })

    if (_.isUndefined(list) && id) {
      list = this.createList(id)
      lists.push(list)
      Store.update('lists', lists)
    }

    return list.children || []
  }

  /**
   * Set task list
   * @param {number} Task id of list
   * @param {array} New children
   * @return {void}
   */
  static setListChildren(id, children) {
    const lists = Store.getData('lists')
    const list = _.findWhere(lists, {
      taskId: id
    })
    const index = lists.indexOf(list)

    list.children = children
    lists[index] = list
    Store.update('lists', lists)
  }

  /**
   * Insert a task into another task list
   * @param {object} Task to be inserted
   * @param {object} (Optional) Id of task that the new task will be inserted after
                     If no Id provided, new task is simply appended to the list
   * @param {object} (Optional) ParentId of list that the new task will be inserted into
                     If no ParentId provided, new task is inserted into its direct parent's list
   * @return {void}
   */
  static spliceToList(task, appendTo, listParentId = null) {
    const listId = listParentId || task.parentId
    const parentList = this.getListChildren(listId)

    if (appendTo) {
      const taskIndex = parentList.indexOf(appendTo) + 1

      parentList.splice(taskIndex, 0, task.id)
    } else {
      parentList.push(task.id)
    }

    this.setListChildren(listId, parentList)
  }

  /**
   * Remove a task from its parent's task list
   * @param {object} Task to be removed
   * @return {void}
   */
  static spliceFromList(task) {
    const listChildren = this.getListChildren(task.parentId)

    listChildren.splice(listChildren.indexOf(task.id), 1)
    this.setListChildren(task.parentId, listChildren)
  }
}
