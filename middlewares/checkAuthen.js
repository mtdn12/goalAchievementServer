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
      // Revoke refresh token
      await admin.auth().revokeRefreshTokens(decodedToken.uid)
      const userRevoke = await admin.auth().getUser(decodedToken.uid)
      const time =
        (await new Date(userRevoke.tokensValidAfterTime).getTime()) / 1000
      console.log('Tokens revoked at: ', time)
      next()
    })
    .catch(err => {
      return res.json({
        error: 'UnAuthorization',
      })
    })
}
module.exports = checkAuthen
