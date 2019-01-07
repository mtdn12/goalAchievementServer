const updateRecallTime = time => {
  switch (time) {
    case 0:
      return Date.now() + 1000 * 60 * 60 * 24
    case 1:
      return Date.now() + 1000 * 60 * 60 * 24 * 3
    case 2:
      return Date.now() + 1000 * 60 * 60 * 24 * 7
    case 3:
      return Date.now() + 1000 * 60 * 60 * 24 * 30
    case 4:
      return Date.now() + 1000 * 60 * 60 * 24 * 90
    case 5:
      return Date.now() + 1000 * 60 * 60 * 24 * 180
    case 6:
      return Date.now() + 1000 * 60 * 60 * 24 * 365
    default:
      return Date.now() + 1000
  }
}
module.exports = updateRecallTime
