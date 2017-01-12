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
    const methods = _.omit(this.props, 'task')

    return (
      <div>
        <div
          ref={(div) => { this.taskInput = div }}
          className='task-text'
          contentEditable
          suppressContentEditableWarning
          onKeyPress={this.onKeyPress}
          onInput={this.onInput}
        >
          {task.text}
        </div>
        {this.props.list && this.props.list.children
          ? (
            <List
              list={this.props.list}
              {...methods}
            />
          ) : null
        }
      </div>
    )
  }

  onKeyPress = (e) => {
    if (e.which === KEYS.enter) {
      console.log('enter')
      // Create new task
      this.props.insertTask(this.props.task)

      e.preventDefault()
    }
  }

  onInput = () => {
    const value = $(this.taskInput).text()

    this.props.updateTask(this.props.task.id, value)
  }
}
