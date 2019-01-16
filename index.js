const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const keys = require('./config')
const cors = require('cors')
// const cron = require('node-cron')
const CronJob = require('cron').CronJob

// Import helper function
const CollectActions = require('./helpers/CollectActions')
const countRecallWord = require('./helpers/countRecallWord')
const reCountTodo = require('./helpers/CountTodoList')

function prepareServer() {
  // Route List
  const users = require('./routes/api/users')

  const goals = require('./routes/api/goals')

  const objectives = require('./routes/api/objectives')

  const strategies = require('./routes/api/strategies')

  const tatics = require('./routes/api/tatics')

  const actions = require('./routes/api/actions')

  const histories = require('./routes/api/history')

  const dailyTasks = require('./routes/api/dailytask')

  const books = require('./routes/api/books')

  const words = require('./routes/api/words')

  const todos = require('./routes/api/todo')

  const dailyTodos = require('./routes/api/dailyTodo')

  const historyTodos = require('./routes/api/historyTodo')
  // start express app
  const app = express()
  // Body parser middleware
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  // app.use(authCheck)
  app.use(cors())

  // console.log(admin.auth())

  // User Routes
  app.use('/api/users', users)

  app.use('/api/goals', goals)

  app.use('/api/objectives', objectives)

  app.use('/api/strategies', strategies)

  app.use('/api/tatics', tatics)

  app.use('/api/actions', actions)

  app.use('/api/histories', histories)

  app.use('/api/dailytasks', dailyTasks)

  app.use('/api/books', books)

  app.use('/api/words', words)

  app.use('/api/todos', todos)

  app.use('/api/dailyTodos', dailyTodos)

  app.use('/api/todoHistories', historyTodos)

  // DB config
  mongoose
    .connect(
      keys.mongoURI,
      { useNewUrlParser: true }
    )
    .then(() => console.log('MongoDb Connected'))
    .catch(err => console.log(err))

  let PORT = process.env.PORT || 5000

  app.listen(PORT, () => {
    console.log(`Listen on port ${PORT}`)
  })
}
function init() {
  prepareServer()
  const job = new CronJob(
    '00 00 23 * * *',
    () => {
      reCountTodo()
      countRecallWord()
      CollectActions()
    },
    null,
    true,
    'Asia/Ho_Chi_Minh'
  )
  job.start()
}
init()
