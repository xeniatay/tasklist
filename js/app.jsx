import _ from 'underscore'
import React from 'react'
import ReactDOM from 'react-dom'
import Actions from './actions.js'
import Constants from './constants.js'
import Legend from './legend.jsx'
import Store from './store.js'
import Task from './task.jsx'

class App extends React.Component {
  constructor(props) {
    super(props)

    const data = Store.initialize()
    const task = _.findWhere(data.tasks, {
      parentId: Constants.ROOT_ID
    })

    this.state = {
      data,
      focus: task.id,
      debug: Store.getData('debug')
    }
  }

  render() {
    const list = _.findWhere(this.state.data.lists, {
      taskId: Constants.ROOT_ID
    })

    return (
      <div className={this.state.debug ? 'debug' : ''}>
        <div className='app'>
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
        <div className='info'>
          <button type='button' className='clear' onClick={this.reset}>Clear</button>
          <button type='button' className='debug' onClick={this.toggleDebug}>Debug mode</button>
          <Legend/>
        </div>
      </div>
    )
  }

  insertTask = (task) => {
    const newTaskId = Actions.insertTask(task)

    this.focusTask(newTaskId)
    this.updateData()
  }

  updateTask = (id, value) => {
    Actions.updateTask(id, value)
    this.updateData()
    this.focusTask(id)
  }

  indentTask = (task) => {
    Actions.indentTask(task)
    this.focusTask(task.id)
    this.updateData()
  }

  reverseIndentTask = (task) => {
    Actions.reverseIndentTask(task)
    this.updateData()
  }

  navigateTask = (task, dir) => {
    let id

    if (dir === Constants.DIRECTIONS.up) {
      id = Actions.getPrevTask(task)
    } else if (dir === Constants.DIRECTIONS.down) {
      id = Actions.getNextTask(task)
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
      data: Store.getExposedData()
    })
  }

  reset = () => {
    Store.resetData()
    this.updateData()
  }

  toggleDebug = () => {
    const debug = Store.getData('debug')

    Store.update('debug', !debug)

    this.setState({
      debug: Store.getData('debug')
    })
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
