import $ from 'jquery'
import _ from 'underscore'
import React from 'react'
import ReactDOM from 'react-dom'
import Constants from './constants.js'
import List from './list.jsx'

export default class Task extends React.Component {
  componentDidMount() {
    this.focusTask()
  }

  componentDidUpdate() {
    this.focusTask()
  }

  focusTask() {
    const taskId = this.props.task && this.props.task.id

    if (this.props.focus === taskId) {
      $(this.taskInput).focus()
    }
  }

  render() {
    return (
      <div className='task'>
        {this.renderTask()}
        {this.renderList()}
      </div>
    )
  }

  renderTask() {
    const task = this.props.task

    return task
      ? (
        <div
          ref={(div) => { this.taskInput = div }}
          className='task-input'
          data-id={task.id}
          contentEditable
          suppressContentEditableWarning
          onKeyDown={this.onKeyDown}
          onInput={this.onInput}
        >
          {task.text}
        </div>
      ) : null
  }

  renderList() {
    const list = this.props.list
    const props = _.omit(this.props, 'task')

    return list && list.children
      ? (
        <List
          {...props}
        />
      ) : null
  }

  onKeyDown = (e) => {
    switch (e.which) {
      case Constants.KEYS.enter:
        this.props.insertTask(this.props.task)
        e.preventDefault()
        break

      case Constants.KEYS.tab:
        if (e.shiftKey) {
          this.props.reverseIndentTask(this.props.task)
        } else {
          this.props.indentTask(this.props.task)
        }

        e.preventDefault()
        break

      case Constants.KEYS.downArrow:
        this.props.navigateTask(this.props.task, Constants.DIRECTIONS.down)
        e.preventDefault()
        break

      case Constants.KEYS.upArrow:
        this.props.navigateTask(this.props.task, Constants.DIRECTIONS.up)
        e.preventDefault()
        break

      case Constants.KEYS.escape:
        break

      default:
        break
    }
  }

  onInput = () => {
    const value = $(this.taskInput).text()

    this.props.updateTask(this.props.task.id, value)
  }
}

// todo defualtprops
// list props
