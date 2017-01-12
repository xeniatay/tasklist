import _ from 'underscore'
import React from 'react'
import ReactDOM from 'react-dom'
import Task from './task.jsx'

export default class List extends React.Component {
  render() {
    const props = _.omit(this.props, 'list')

    return (
      <div>
        {_.map(this.props.list, (task, i) => {
          return <Task
            key={i}
            task={task}
            {...props}
          />
        })}
      </div>
    )
  }
}
