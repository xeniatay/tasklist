import _ from 'underscore'
import React from 'react'
import ReactDOM from 'react-dom'
import Constants from './constants.js'
import Task from './task.jsx'
import Actions from './actions.js'

const ROOT_ID = _.uniqueId()

class App extends React.Component {
  constructor(props) {
    super(props)

    this.actions = new Actions(ROOT_ID)

    const data = this.actions.getData()
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
      <div className='app'>
        <button type='button' onClick={this.reset}>Reset Data</button>
        <button type='button' onClick={this.toggleDebug}>Debug</button>
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
    const newTaskId = this.actions.insertTask(task)

    this.focusTask(newTaskId)
    this.updateData()
  }

  updateTask = (id, value) => {
    this.actions.updateTask(id, value)
    this.updateData()
    this.focusTask(id)
  }

  indentTask = (task) => {
    this.actions.indentTask(task)
    this.focusTask(task.id)
    this.updateData()
  }

  reverseIndentTask = (task) => {
    this.actions.reverseIndentTask(task)
    this.updateData()
  }

  navigateTask = (task, dir) => {
    let id

    if (dir === Constants.DIRECTIONS.up) {
      id = this.actions.getPrevTask(task)
    } else if (dir === Constants.DIRECTIONS.down) {
      id = this.actions.getNextTask(task)
    }

    this.focusTask(id)
  }

  focusTask(id) {
    this.setState({
      focus: id
    })
  }

  updateData() {
    this.setState({
      data: this.actions.getData()
    })
  }

  reset() {
    localStorage.setItem('data', '')
  }

  toggleDebug() {
    let debug = localStorage.getItem('debug') && debug === 'true'

    localStorage.setItem('debug', !!!debug)
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
