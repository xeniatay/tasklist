import _ from 'underscore'
import React from 'react'
import ReactDOM from 'react-dom'
import Task from './task.jsx'

export default class List extends React.Component {
  render() {
    const props = _.omit(this.props, 'list')

    return (
      <div className='list'>
        {_.map(this.props.list.children, (id, i) => {
          const task = _.findWhere(this.props.data.tasks, {
            id: id
          })
          const list = _.findWhere(this.props.data.lists, {
            taskId: id
          })

          return <Task
            key={i}
            task={task}
            list={list}
            {...props}
          />
        }, this)}
      </div>
    )
  }
}
