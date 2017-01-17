# Tasklist!

- An elegant "blank sheet" UI (e.g. Google Docs or a Todo list app) that enables vertically nested Tasks as indented bulleted lists.
- A Task can contain text (as the title) and nested Tasks.
- Allows navigatation via keyboard 

## See it in action

Go to [http://xeniatay.com/tasklist](http://xeniatay.com/tasklist)!

To run locally: 

    // In the root directory:
    > npm install
    > npm start

    Go to localhost:8080

## Project Requirements

- npm 4.0.3 
- Node v6.5.0 
- OSX

### Project Tools

- Webpack
- Babel
- ES6
- React
- SASS

## Features

- Infinitely nested tasks of unlimited length
- Keyboard shortcuts
    + `<enter>` to create a task
    + `<tab>` to indent a task
    + `<shift+tab>` to reverse indent a task
    + `<up>/<down>` to navigate across the task lists
- Task list data persisted in LocalStorage
- Reset button to clear data
- Debug mode (for developers)

## Architecture

### Components

- App.jsx renders: 
    + Root `<Task>`
    + `<Legend>`, instructions for keyboard shortcuts
    + Buttons to toggle options within the app
- Task.jsx (`<Task>`) renders: 
    + A single task 
    + A `<List>`
- List.jsx (`<List>`) renders:
    + All the `<Task>`s in a given list

### Data: js/store.js, js/actions.js, LocalStorage

- Tasklist data is stored and read from the browser's LocalStorage
- Store provides methods to read from, write to and reset this data
- Actions contain the logic methods for the functionality of the app
    - Each logic method has meticulous comments documenting its use case and parameters

## Future Improvements
- More keyboard shortcuts: delete, WYSIWYG
- Drag and drop
- Ability to cross-link/replicate Tasks (where a Task can be nested under multiple Tasks and updated synchronously)
- Ability to enable multiple simultaneous collaborators at the same time
- Data that is persisted on a server instead of LocalStorage
- Proper data flow (redux)
- User accounts

