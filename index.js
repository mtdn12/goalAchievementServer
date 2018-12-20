const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const keys = require('./config')
const cors = require('cors')

// Import helper function
const collectActions = require('./helpers/CollecActions')

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

  app.use('/api/dailytaks', dailyTasks)
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
  // collectActions()
}

function fetchTodo() {
  // Move all Todo to history
  // Clear all daily todo to add new one
  // query all user in database
  // loop through all user list and take all tatics match with that user
  // Check in list tatic what action match with today
  // Add this to daily action today
}

init()
