/* eslint-disable handle-callback-err */
const User = require('../Models/User')
const admin = require('../firebase')

const checkAuthen = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.json({
      error: 'unAuthorization',
    })
  }
  admin
    .auth()
    .verifyIdToken(req.headers.authorization)
    .then(async decodedToken => {
      const user = await User.findOne({ uid: decodedToken.uid })
      if (user) {
        req.user = user
      }
      if (!user) throw new Error()
      next()
    })
    .catch(err => {
      return res.json({
        error: 'UnAuthorization',
        result: 'fail',
      })
    })
}
module.exports = checkAuthen
