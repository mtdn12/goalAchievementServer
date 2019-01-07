const router = require('express').Router()
// const moment = require('moment')
// Load User modal
const Word = require('../../Models/Word')
// Import middlewares
const authCheck = require('../../middlewares/checkAuthen')
// Validator user info
const inputWordValidate = require('../../validation/wordInput')
// Import helper function
const nextRecallTime = require('../../helpers/nextRecallTime')

// Get router
// get all list word match with user
router.get('/', authCheck, async (req, res) => {
  try {
    // find all word
    const words = await Word.find({
      user: req.user._id,
      isRecall: req.query.isRecall ? req.query.isRecall : '',
    })
    if (!words) {
      return res.json({
        result: 'fail',
        status: 500,
        error: 'Could not get list word',
      })
    }
    return res.json({
      status: 200,
      result: 'success',
      items: words,
      message: 'Get list word success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not get list word',
    })
  }
})
// Get router
// Get word detail for specify id
router.get('/:id', authCheck, async (req, res) => {
  try {
    // Find anyword match that id or not
    const word = await Word.findOne({
      user: req.user._id,
      _id: req.params.id,
    })
    // Check if word exist or not
    if (!word) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any word match that id',
      })
    }
    // Return word
    return res.json({
      result: 'success',
      item: word,
      status: 200,
      message: 'Get item detail success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not get word detail',
    })
  }
})

// post router
// Create new word
router.post('/', authCheck, async (req, res) => {
  try {
    const data = req.body
    const { error } = inputWordValidate(data)
    if (error) {
      return res.json({
        result: 'fail',
        status: 500,
        error: error.details[0].message,
      })
    }
    const newWord = new Word({
      user: req.user._id,
      word: data.word,
      description: data.description,
      linkMap: data.linkMap,
      filePath: data.filePath,
    })
    const isSaveWord = await newWord.save()
    if (!isSaveWord) {
      return res.json({
        result: 'fail',
        status: 500,
        error: "Can't not save new word",
      })
    }
    return res.json({
      status: 200,
      result: 'success',
      item: isSaveWord,
      message: 'Create new word success',
    })
  } catch (error) {
    console.log(error)
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not create new word',
    })
  }
})

// Put router
// Edit word

router.put('/:id', authCheck, async (req, res) => {
  try {
    const data = req.body
    const { error } = inputWordValidate(data)
    if (error) {
      return res.json({
        result: 'fail',
        status: 500,
        error: error.details[0].message,
      })
    }
    // Find that word
    const word = await Word.findOne({
      user: req.user._id,
      _id: req.params.id,
    })
    if (!word) {
      return res.json({
        status: 404,
        result: 'fail',
        error: 'Could not found any word match that id',
      })
    }
    // Change infomation
    word.word = data.word
    word.description = data.description
    word.linkMap = data.linkMap
    word.filePath = data.filePath
    // Save new word
    const isSaveWord = await word.save()
    if (!isSaveWord) {
      return res.json({
        result: 'fail',
        status: 500,
        error: 'Could not save new word',
      })
    }
    return res.json({
      result: 'success',
      status: 200,
      item: isSaveWord,
      message: 'Edit word success',
    })
  } catch (error) {
    return res.json({
      status: 400,
      result: 'fail',
      error: 'Could not edit word',
    })
  }
})

// Delete router
// Delete word match with id
router.delete('/:id', authCheck, async (req, res) => {
  try {
    // Find word match with that id and user
    const word = await Word.findOne({
      user: req.user._id,
      _id: req.params.id,
    })
    // Check word exist or not
    if (!word) {
      return res.json({
        status: 404,
        result: 'fail',
        error: 'Could not found any word match that id',
      })
    }
    // Delete word
    const isDelete = await word.delete()
    // Check delete success or not
    if (!isDelete) {
      return res.json({
        result: 'fail',
        status: 500,
        error: 'Could not delete that word',
      })
    }
    // return success
    return res.json({
      result: 'success',
      status: 200,
      message: 'Delete word success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not delete word',
    })
  }
})

// Router post
// Check recall success

router.post('/check/:id', authCheck, async (req, res) => {
  try {
    // Find that word
    const word = await Word.findOne({
      user: req.user._id,
      _id: req.params.id,
    })
    // Check word exist or not
    if (!word) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any word match that id',
      })
    }
    // Check done process
    // + Change nextRecall depend on recallItem
    word.nextRecall = nextRecallTime(word.timeRecall)
    //  + Increase recall Time by 1
    word.timeRecall += 1
    // Save new word
    const isSaveWord = await word.save()
    // check save success or not
    if (!isSaveWord) {
      return res.json({
        result: 'fail',
        status: 500,
        error: 'Could not save update word ',
      })
    }
    // return result
    return res.json({
      result: 'success',
      status: 200,
      item: isSaveWord,
    })
  } catch (error) {
    console.log(error)
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not check done that word',
    })
  }
})

module.exports = router
