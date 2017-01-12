export default class Utils {
  static getData() {
    return {
      lists: [
        {
          taskId: 0,
          children: [1, 6]
        },
        {
          taskId: 1,
          children: [2, 3]
        },
        {
          taskId: 2,
          children: [4, 5]
        }
      ],
      tasks: [
        { id: 1, parentId: 0, text: '1st task' },
        { id: 2, parentId: 1, text: '2nd task' },
        { id: 3, parentId: 1, text: '3rd task' },
        { id: 4, parentId: 2, text: '4th task' },
        { id: 5, parentId: 2, text: '5th task' },
        { id: 6, parentId: 0, text: '6th task' }
      ]
    }
  }
}
