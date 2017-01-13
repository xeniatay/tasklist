import _ from 'underscore'

export default class Store {
  constructor(rootId) {
    const seedTask = this.createTask(rootId)

    this.tasks = [seedTask]
    this.lists = [ this.createList(rootId, [seedTask.id]) ]
  }

  getData() {
    return {
      lists: this.lists,
      tasks: this.tasks
    }
  }

  createList(id, children = []) {
    return {
      taskId: id,
      children: children
    }
  }

  createTask(parentId) {
    return {
      id: _.uniqueId(),
      parentId: parentId,
      text: ''
    }
  }

  addTask(newTask) {
    this.tasks.push(newTask)
  }

  insertTaskIntoList(newTask, insertAfter) {
    const list = _.findWhere(this.lists, {
      taskId: newTask.parentId
    })
    const newTaskIndex = list.children.indexOf(insertAfter) + 1

    list.children.splice(newTaskIndex, 0, newTask.id)
  }

  // task here is existing task that insert is going after
  insertTask(task) {
    const newTask = this.createTask(task.parentId)

    this.addTask(newTask)
    this.insertTaskIntoList(newTask, task.id)

    console.log('insertTask', this.lists, this.tasks, newTask)

    return newTask.id
  }

  updateTask(id, value) {
    const task = _.findWhere(this.tasks, {
      id: id
    })

    _.extend(task, {
      text: value
    })
  }

  indentTask(task) {
    const currentList = this.getListById(task.parentId).children
    const listIndex = currentList.indexOf(task.id)

    if (_.first(currentList) === task.id) {
      // do nothing
      console.log('do nothing')
    } else {
      const newParentId = currentList[listIndex - 1]
      const taskIndex = this.tasks.indexOf(task)
      let newList = this.getListById(newParentId)

      currentList.splice(listIndex, 1)
      this.tasks[taskIndex].parentId = newParentId

      if (newList) {
        newList.children.push(task.id)
      } else {
        newList = this.createList(newParentId, [task.id])

        this.lists.push(newList)
      }
    }

    console.log('indent task', this.lists, this.tasks)
  }

  getListById(id) {
    return _.findWhere(this.lists, {
      taskId: id
    })
  }
}
