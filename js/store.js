import _ from 'underscore'
import Constants from './constants.js'
import Actions from './actions.js'

export default class Store {
  static initialize() {
    const seeded = this.getData('seeded')

    if (!seeded) {
      this.seedData()
    }

    return this.getExposedData()
  }

  static seedData() {
    const rootTask = Actions.createTask(null, Constants.ROOT_ID)
    const seedTask = Actions.createTask(Constants.ROOT_ID)
    const tasks = [rootTask, seedTask]
    const lists = [ Actions.createList(Constants.ROOT_ID, [seedTask.id]) ]

    this.setData('lists', lists)
    this.setData('tasks', tasks)
    this.setData('Constants.ROOT_ID', Constants.ROOT_ID)
    this.setData('seeded', true)
  }

  static getData(attr) {
    return JSON.parse(localStorage.getItem(attr))
  }

  static setData(attr, data) {
    this[attr] = data
    localStorage.setItem(attr, JSON.stringify(data))
  }

  static resetData() {
    this.seedData()
  }

  static update(attr, data) {
    this.setData(attr, data)
  }

  static getExposedData() {
    return {
      lists: this.getData('lists'),
      tasks: this.getData('tasks')
    }
  }
}
