// Import models
const TodoHistory = require('../Models/ToDoHistory')
const Todo = require('../Models/ToDo')
const DailyTodo = require('../Models/DailyToDo')
const User = require('../Models/User')

const reCountTodo = async () => {
  try {
    console.log('cron job run')
    // Find all users
    console.log('cron job run before query')
    const users = await User.find()
    console.log('cron job run 1')
    // Loopthrough all user and find all todos match with that user
    const promises = []
    users.forEach(user => {
      const todos = Todo.find({
        user: user._id,
      }).exec()
      promises.push(todos)
    })
    const userTodos = await Promise.all(promises)
    // Count history and create new History
    userTodos.forEach(todos => {
      if (todos.length > 0) {
        let completed = todos.filter(todo => todo.isComplete)
        let percent = ((completed.length / todos.length) * 100).toFixed(2)
        let details = todos.map(todo => ({
          todo: todo.todo,
          isComplete: todo.isComplete,
        }))
        const history = new TodoHistory({
          percent,
          user: todos[0].user,
          details,
        })
        console.log(history)
        history.save()
      }
    })
    // Delete all current todo
    await Todo.deleteMany()
    // Find all Daily task
    const dailyTasks = await DailyTodo.find()
    // loopThrough all daily task and then create new Todo
    console.log('daily task', dailyTasks)
    dailyTasks.forEach(daily => {
      let todo = new Todo({
        todo: daily.todo,
        user: daily.user,
      })
      todo.save()
    })
    // Done
    return true
  } catch (error) {
    console.log(error)
  }
}

module.exports = reCountTodo
