import _ from 'underscore'

export default class Store {
  constructor(rootId) {
    const rootTask = this.createTask(null, rootId)
    const seedTask = this.createTask(rootId)

    this.rootId = rootId
    this.tasks = [rootTask, seedTask]
    this.lists = [ this.createList(rootId, [seedTask.id]) ]
  }

  getData() {
    return {
      lists: this.lists,
      tasks: this.tasks
    }
  }

  /**
   * Create new task list
   * @param {number} Task id
   * @param {array} Children in task list, defaults to []
   * @return {object} Task list
   */
  createList(id, children = []) {
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
  createTask(parentId, id = null) {
    return {
      id: id || _.uniqueId(),
      parentId: parentId,
      text: ''
    }
  }

  /**
   * Add a task to the 'tasks' data structure
   * @param {object} Task to be added
   * @return {void}
   */
  addTask(newTask) {
    this.tasks.push(newTask)
  }

  /**
   * Insert a task into the document
   * Determine new task position based off the taskForAppend
   * @param {object} Task that triggered the insert event.
                     The new task will be inserted after this task.
   * @return {number} Id of new task
   */
  insertTask(appendTo) {
    const newTask = this.createTask(appendTo.parentId)

    this.addTask(newTask)
    this.spliceToList(newTask, appendTo.id)

    console.log('insertTask', this.lists, this.tasks, newTask)

    return newTask.id
  }

  /**
   * Insert a new task into its parent's task list
   * Determine new task position based off the appendTo
   * @param {object} Task to be inserted
   * @param {object} Id of task that the new task will be inserted after
   * @return {void}
   */
  updateTask(id, value) {
    const task = this.getTask(id)

    _.extend(task, {
      text: value
    })
  }

  /**
   * Indent a task
   * i.e. {task} gets appended to the task list of its immediate previous sibling
   * If there is no previous sibling task, do nothing
   * @param {object} Task to be indented
   * @return {void}
   */
  indentTask(task) {
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
      task.parentId = newParentId
      this.spliceToList(task)
    }

    console.log('indent task', this.lists, this.tasks)
  }

  /**
   * Reverse indent a task
   * i.e. {task} becomes the direct next sibling of its original parent task
   * @param {object} Task to be reverse indented
   * @return {void}
   */
  reverseIndentTask(task) {
    const parent = this.getTask(task.parentId)

    if (task.parentId !== this.rootId) {
      this.spliceFromList(task)
      task.parentId = parent.parentId
      this.spliceToList(task, parent.id, parent.parentId)
    }
  }

  /**
   * Return ID of the previous task in the visual hierarchy
   * @param {object} Current task
   * @return {number} ID of previous task
   */
  getPrevTask(task) {
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
  getPrevVisualSibling(id) {
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
  getNextTask(task) {
    const list = this.getListChildren(task.id)
    let focusId = task.id

    // If a list of immediate children exists, get the first child
    if (list.length) {
      focusId = _.first(list)

    // Get the next task based off the parent list
    } else {
      const parentList = this.getListChildren(task.parentId)
      const isNotRoot = task.parentId !== this.rootId

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
  getNextVisualSibling(task, prevTaskId) {
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
  getTask(id) {
    return _.findWhere(this.tasks, {
      id: id
    }) || null
  }

  /**
   * Get index of task in a task list
   * @param {object} Task
   * @return {number} Index of task
   */
  getListIndexOf(task) {
    const listChildren = this.getListChildren(task.parentId)

    return listChildren.indexOf(task.id)
  }

  /**
   * Get task list
   * @param {number} Task id
   * @return {array} Task list
   */
  getListChildren(id) {
    let list = _.findWhere(this.lists, {
      taskId: id
    })

    if (_.isUndefined(list) && id) {
      list = this.createList(id)
      this.lists.push(list)
    }

    return list.children
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
  spliceToList(task, appendTo, listParentId) {
    const listChildren = this.getListChildren(listParentId || task.parentId)

    if (appendTo) {
      const taskIndex = listChildren.indexOf(appendTo) + 1

      listChildren.splice(taskIndex, 0, task.id)
    } else {
      listChildren.push(task.id)
    }
  }

  /**
   * Remove a task from its parent's task list
   * @param {object} Task to be removed
   * @return {void}
   */
  spliceFromList(task) {
    const listChildren = this.getListChildren(task.parentId)

    listChildren.splice(listChildren.indexOf(task.id), 1)
  }
}
