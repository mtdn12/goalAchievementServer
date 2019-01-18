const RecountTodo = require('./helpers/CountTodoList')
const mongoose = require('mongoose')
const keys = require('./config')
// DB config
mongoose
  .connect(
    keys.mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDb Connected'))
  .catch(err => console.log(err))

RecountTodo()
