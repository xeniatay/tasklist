import _ from 'underscore'
import React from 'react'
import ReactDOM from 'react-dom'

export default class Legend extends React.Component {
  render() {
    return (
      <table>
        <thead>
          <tr>
            <th colSpan='2'>Legend</th>
          </tr>
        </thead>
        {this.renderShortcuts()}
      </table>
    )

  }

  renderShortcuts() {
    return (
      <tbody>
        <tr>
         <td>
            Add a task
          </td><td>
            {'<Enter>'}
          </td>
        </tr>
        <tr>
         <td>
           Indent a task
          </td><td>
            {'<Tab>'}
          </td>
        </tr>
        <tr>
         <td>
           Reverse indent a task
          </td><td>
            {'<Shift + Tab>'}
          </td>
        </tr>
        <tr>
         <td>
           Navigate to the previous/next task
          </td><td>
            {'<Up>/<Down>'}
          </td>
        </tr>
      </tbody>
    )
  }
}
