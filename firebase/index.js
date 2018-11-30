const admin = require('firebase-admin')

const serviceAccount = require('../config/firebaseServiceAccount.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://goals-achievement-8451b.firebaseio.com"
})

module.exports = admin