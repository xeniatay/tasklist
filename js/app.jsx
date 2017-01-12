import _ from 'underscore'
import React from 'react'
import ReactDOM from 'react-dom'
import Task from './task.jsx'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: this.createTask()
    }
  }

  render() {
    const data = this.state.data

    return (
      <div>
        <Task
          task={data}
          parents={[]}
          insertTask={this.insertTask}
          updateTask={this.updateTask}
        />
      </div>
    )
  }

  createTask() {
    return {
      id: _.uniqueId(),
      text: 'parent',
      list: [
        {
          id: _.uniqueId(),
          text: 'child',
          list: [
            {
              id: _.uniqueId(),
              text: 'child1',
              list: [
                {
                  id: _.uniqueId(),
                  text: 'child2',
                  list: []
                }
              ]
            }
          ]
        }
      ]
    }
  }

  insertTask = (id) => {
    console.log('insert task')
  }

  updateTask = (task, newTask) => {
    const data = this.state.data
    const oldTask = _.findWhere(data, task)

    console.log('udpate task', oldTask)
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
