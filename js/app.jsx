import _ from 'underscore'
import React from 'react'
import ReactDOM from 'react-dom'
import Task from './task.jsx'
import Store from './store.js'

const ROOT_ID = _.uniqueId()

class App extends React.Component {
  constructor(props) {
    super(props)

    this.store = new Store(ROOT_ID)

    const data = this.store.getData()
    const task = _.findWhere(data.tasks, {
      parentId: ROOT_ID
    })

    this.state = {
      data,
      focus: task.id
    }
  }

  render() {
    const list = _.findWhere(this.state.data.lists, {
      taskId: ROOT_ID
    })

    return (
      <div>
        <Task
          list={list}
          data={this.state.data}
          focus={this.state.focus}
          insertTask={this.insertTask}
          updateTask={this.updateTask}
          indentTask={this.indentTask}
          reverseIndentTask={this.reverseIndentTask}
          navigateTask={this.navigateTask}
          deleteTask={this.deleteTask}
        />
      </div>
    )
  }

  insertTask = (task) => {
    const newTaskId = this.store.insertTask(task)

    this.focusTask(newTaskId)
    this.updateData()
  }

  updateTask = (id, value) => {
    this.store.updateTask(id, value)
    this.updateData()
  }

  indentTask = (task) => {
    this.store.indentTask(task)
    this.focusTask(task.id)
    this.updateData()
  }

  reverseIndentTask = (task) => {
    this.store.reverseIndentTask(task)
    this.updateData()
  }

  navigateTask = (task) => {
    // todo
    // this.store.reverseIndentTask(task)
    // this.focusTask()
  }

  deleteTask = (task) => {
    //todo
    // this.store.deleteTask(task)
    // this.focusTask()
    this.updateData()
  }

  focusTask(id) {
    this.setState({
      focus: id
    })
  }

  updateData() {
    this.setState({
      data: this.store.getData()
    })
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
