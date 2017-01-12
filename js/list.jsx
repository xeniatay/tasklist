import _ from 'underscore'
import React from 'react'
import ReactDOM from 'react-dom'
import Task from './task.jsx'
import Utils from './utils.js'

let DATA = Utils.getData()

export default class List extends React.Component {
  render() {
    const methods = _.omit(this.props, 'list')

    return (
      <div>
        {_.map(this.props.list.children, (taskId, i) => {
          const task = _.findWhere(DATA.tasks, {
            id: taskId
          })

          return <Task
            key={i}
            task={task}
            {...methods}
          />
        })}
      </div>
    )
  }
}
