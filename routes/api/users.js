const router = require('express').Router()

// Load User modal

const User = require('../../Models/User')

// Validator user info
const validateUserInfo = require('../../validation/register')

// @Route Post api/users/register
// @desc Resiger User for app
// @acces public

router.post('/register', async (req, res) => {
  try {
    const { errors, isValid } = validateUserInfo(req.body)
    if (!isValid) {
      return res.json({
        result: 'fail',
        status: 400,
        errors,
      })
    }
    const user = await User.findOne({
      uid: req.body.uid,
    })
    if (user) {
      return res.json({
        message: 'User already exist',
      })
    } else {
      const newUser = new User({
        uid: req.body.uid,
        name: req.body.name,
        email: req.body.email,
      })
      await newUser.save()
      return res.send('Ok')
    }
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      message: "Can't register user",
    })
  }
})

module.exports = router
