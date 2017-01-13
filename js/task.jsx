import $ from 'jquery'
import _ from 'underscore'
import React from 'react'
import ReactDOM from 'react-dom'
import List from './list.jsx'

const KEYS = {
  enter: 13,
  tab: 9,
  shift: 16,
  shiftTab: 84,
  downArrow: 40,
  upArrow: 38,
  backspace: 8,
  escape: 27,
}

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
      case KEYS.enter:
        this.props.insertTask(this.props.task)
        e.preventDefault()
        break

      case KEYS.tab:
        this.props.indentTask(this.props.task)
        e.preventDefault()
        break

      case KEYS.shiftTab:
        console.log('shifttab')
        this.props.reverseIndentTask(this.props.task)
        e.preventDefault()
        break

      case KEYS.downArrow:
        this.props.navigateTask()
        break

      case KEYS.upArrow:
        this.props.navigateTask()
        break

      case KEYS.backspace:
        const value = $(this.taskInput).text()

        if (_.isEmpty(value)) {
          this.props.deleteTask(this.props.task)
        }
        break

      case KEYS.escape:
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
