const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const keys = require('./config')
const cors = require('cors')

// Route List
const users = require('./routes/api/users')

const goals = require('./routes/api/goals')

const objectives = require('./routes/api/objectives')

const strategies = require('./routes/api/strategies')

const tatics = require('./routes/api/tatics')
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
