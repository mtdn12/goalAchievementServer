async function getChildren(arr, Model) {
  const promies = arr.map(
    item =>
      new Promise((resolve, reject) => {
        Model.findById(item._id, (err, obj) => {
          if (err) {
            reject(err)
          } else {
            resolve(obj)
          }
        })
      })
  )
  let result = await Promise.all(promies)
  return result
}

module.exports = getChildren
