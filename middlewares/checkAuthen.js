/* eslint-disable handle-callback-err */
const User = require('../Models/User')
const admin = require('../firebase')

const checkAuthen = (req, res, next) => {
  admin
    .auth()
    .verifyIdToken(req.headers.authorization)
    .then(async decodedToken => {
      console.log(decodedToken)
      const user = await User.findOne({ uid: decodedToken.uid })
      if (user) next()
    })
    .catch(err => {
      return res.json({
        errors: 'UnAuthorization',
      })
    })
}
module.exports = checkAuthen
