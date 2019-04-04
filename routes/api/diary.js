const router = require('express').Router()

// import middleware
const authCheck = require('../../middlewares/checkAuthen')
// Import model
const Diary = require('../../Models/Diary')
// Import vaidation
const diaryInputValidation = require('../../validation/diaryInput')

// Get router
// Get list diary

router.get('/', authCheck, async (req, res) => {
  try {
    const page = +req.query.page - 1 || 0
    const limit = +req.query.limit || 100
    const totalCount = await Diary.count()
    const todos = await Diary.find({
      user: req.user._id,
    })
      .skip(page * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
    if (!todos) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any diary',
      })
    }
    const totalPages = Math.ceil(totalCount / limit)
    return res.json({
      result: 'success',
      status: 200,
      items: todos,
      totalPages,
      message: 'Get list diary success ',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 500,
      error: 'Could not get list diary',
    })
  }
})

// Router get
// Get diary detail depend on id
router.get('/:id', authCheck, async (req, res) => {
  try {
    // Find diary exist or not
    const diary = await Diary.findOne({
      user: req.user._id,
      _id: req.params.id,
    })
    if (!diary) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any diary match with that id',
      })
    }
    // return result
    return res.json({
      result: 'success',
      status: 200,
      item: diary,
      message: 'Get diary detail success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not get diary detail',
    })
  }
})

// Router post
// Create new diary
router.post('/', authCheck, async (req, res) => {
  try {
    const data = req.body
    // Check validation
    const { error } = diaryInputValidation(data)
    if (error) {
      return res.json({
        result: 'fail',
        status: 400,
        error: error.details[0].message,
      })
    }
    // Create new diary
    const diary = new Diary({
      user: req.user._id,
      content: data.content,
    })
    // save new diary
    const isSaveDiary = await diary.save()
    // Check save success or not
    if (!isSaveDiary) {
      return res.json({
        result: 'fail',
        status: 500,
        error: 'Could not save new diary',
      })
    }
    // return success
    res.json({
      result: 'success',
      status: 200,
      item: isSaveDiary,
      message: 'Create diary success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 500,
      error: 'Could not create new diary',
    })
  }
})

// Put router
// Edit existing diary
router.put('/:id', authCheck, async (req, res) => {
  try {
    const data = req.body
    // validation
    const { error } = diaryInputValidation(data)
    if (error) {
      return res.json({
        result: 'fail',
        status: 400,
        error: error.details[0].message,
      })
    }
    // Find diary exist or not
    const diary = await Diary.findOne({
      user: req.user._id,
      _id: req.params.id,
    })
    if (!diary) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any diary match with that id',
      })
    }
    // Update new content
    diary.content = data.content
    // Save new diary
    const isSaveDiary = await diary.save()

    if (!isSaveDiary) {
      return res.json({
        result: 'fail',
        status: 500,
        error: 'Could not save new diary',
      })
    }
    // Return success
    return res.json({
      result: 'success',
      status: 200,
      item: isSaveDiary,
      message: 'Edit diary success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not edit diary',
    })
  }
})

// Delete router
// Delete existing diary

router.delete('/:id', authCheck, async (req, res) => {
  try {
    // Find that diary exist or not
    const diary = await Diary.findOne({
      user: req.user._id,
      _id: req.params.id,
    })
    if (!diary) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any diary match with that id',
      })
    }
    // Delete dairy
    const isDelete = await diary.delete()
    if (!isDelete) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not delete diary',
      })
    }
    // return success
    return res.json({
      result: 'success',
      status: 200,
      message: 'delete diary success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'could not delete diary',
    })
  }
})

// export router

module.exports = router
