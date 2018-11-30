const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const keys = require('./config')
const admin = require('./firebase')

// start express app
const app = express()

console.log(admin.auth())

// DB config
mongoose.connect(keys.mongoURI)
  .then(() => console.log("MongoDb Connected"))
  .catch(err => console.log(err))



let PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`)
})