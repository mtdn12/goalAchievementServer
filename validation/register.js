const Validator = require('validator')
const isEmpty = require('./is-empty')

const validateUserInfo = data => {
  let errors = {}
  data.uid = !isEmpty(data.uid) ? data.uid : ''
  data.email = !isEmpty(data.email) ? data.email : ''
  if (Validator.isEmpty(data.uid)) {
    errors.uid = 'Uid is required'
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email is required'
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Invalid Email'
  }
  return {
    errors,
    isValid: isEmpty(errors),
  }
}

module.exports = validateUserInfo
