import $ from 'jquery'
import _ from 'underscore'
import React from 'react'
import ReactDOM from 'react-dom'
import List from './list.jsx'

const KEYS = {
  enter: 13,
}

export default class Task extends React.Component {
  render() {
    const task = this.props.task
    const parents = this.props.parents
    const methods = _.omit(this.props, 'task', 'parents')

    parents.push(task.id)

    console.log('parents', parents)

    return (
      <div>
        <div
          ref={(task) => { this.task = task }}
          className='task-text'
          contentEditable
          suppressContentEditableWarning
          onKeyPress={this.onKeyPress}
          onInput={this.onInput}
        >
          {task.text}
        </div>
        <List
          list={task.list}
          parents={parents}
          {...methods}
        />
      </div>
    )
  }

  onKeyPress = (e) => {
    if (e.keyCode === KEYS.enter) {
      console.log('enter')
      // Create new task
      this.props.insertTask(this.props.id)
    }
  }

  onInput = () => {
    const elem = this.task
    const value = $(elem).text()
    const newTask = _.extend(this.props.task, {
      text: value,
    })

    this.props.updateTask(this.props.task, newTask)
  }
}
