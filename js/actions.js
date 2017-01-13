import _ from 'underscore'

export default class Store {
  constructor(rootId) {
    const seedTask = this.createTask(rootId)

    // Root list is a special case where the the task list contains itself as a task
    this.tasks = [seedTask]
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
   * @return {object} Task
   */
  createTask(parentId) {
    return {
      id: _.uniqueId(),
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
    const task = _.findWhere(this.tasks, {
      id: id
    })

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
    const oldListChildren = this.getListChildren(task.parentId)
    const oldListIndex = oldList.indexOf(task.id)

  }

  navigateTask(task, direction) {
    // get direction
    // find task id of prev/next in list
    // if first/last item, find parent
      // if last item, find sibling of parent
  }

  deleteTask(task) {
    // splice item
    // return prev index in list for focus
    // else return parent for focus
  }

  // getList(id) {
  //   return _.findWhere(this.lists, {
  //     taskId: id
  //   })
  // }

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

    if (!list) {
      list = this.createList(id)
      this.lists.push(list)
    }

    return list.children
  }

  /**
   * Insert a task into its parent's task list
   * If there is {appendTo}, insert task after the {appendTo}
   * Else, insert the task to the end of the task list
   * @param {object} Task to be inserted
   * @param {object} (Optional) Id of task that the new task will be inserted after
                     If no Id provided, new task is simply appended to the list
   * @return {void}
   */
  spliceToList(task, appendTo) {
    const listChildren = this.getListChildren(task.parentId)

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
