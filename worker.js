const RecountTodo = require('./helpers/CountTodoList')
const mongoose = require('mongoose')
const keys = require('./config')
// connected mongo database
mongoose
  .connect(
    keys.mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDb Connected'))
  .catch(err => console.log(err))
// ReCount List todo
RecountTodo()
