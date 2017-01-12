import _ from 'underscore'
import React from 'react'
import ReactDOM from 'react-dom'
import Task from './task.jsx'
import Utils from './utils.js'

let DATA = Utils.getData()

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const id = 1
    const task = _.findWhere(DATA.tasks, {
      id: id
    })
    const list = _.findWhere(DATA.lists, {
      taskId: id
    })

    return (
      <div>
        <Task
          task={task}
          list={list}
          insertTask={this.insertTask}
          updateTask={this.updateTask}
        />
      </div>
    )
  }

  createTask(parentId, after) {
    const newTask = {
      id: _.uniqueId(),
      parentId: parentId,
      text: ''
    }
    const list = _.findWhere(DATA.lists, {
      taskId: parentId
    })
    const index = _.indexOf(DATA.lists, list)
    const listChildren = list.children
    const newTaskIndex = listChildren.indexOf(after)

    DATA.tasks.push(newTask)
    listChildren.splice(newTaskIndex + 1, 0, newTask.id)

    DATA.lists[index].children = listChildren
    console.log('createdTask', DATA)
  }

  insertTask = (task) => {
    const newTask = this.createTask(task.parentId, task.id)
    console.log('insertedTask', DATA)
  }

  updateTask = (id, value) => {
    const task = _.findWhere(DATA.tasks, {
      id: id
    })
    const index = _.indexOf(DATA.tasks, task)

    DATA.tasks[index] = _.extend({}, task, {
      text: value
    })

    console.log('updatedTask', DATA)
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
