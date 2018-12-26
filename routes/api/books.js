const router = require('express').Router()

// Import model
const Book = require('../../Models/Book')

// import middlewares
const authCheck = require('../../middlewares/checkAuthen')
// Import validation
const inputBookValidation = require('../../validation/bookInput')

// Post router
// Create new book to list
router.post('/', authCheck, async (req, res) => {
  try {
    const data = req.body
    const { error } = inputBookValidation(data)
    if (error) {
      return res.json({
        result: 'fail',
        status: 500,
        error: error.details[0].message,
      })
    }
    const book = new Book({
      user: req.user._id,
      title: data.title,
      author: data.author,
      review: data.review,
      status: data.status ? data.status : 'new',
      rate: data.rate,
    })
    const isSaveBook = await book.save()
    if (!isSaveBook) {
      return res.json({
        result: 'fail',
        status: 400,
        error: 'Could not save new book',
      })
    }
    return res.json({
      result: 'success',
      status: 200,
      item: isSaveBook,
      message: 'Create new book success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not create new book',
    })
  }
})

// Get router
// Get book detail
router.get('/:id', authCheck, async (req, res) => {
  try {
    // Find book match with that id
    const book = await Book.findOne({
      user: req.user._id,
      _id: req.params.id,
    })
    // Check if have or not
    if (!book) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not find any book match with that id',
      })
    }
    // return
    return res.json({
      result: 'success',
      status: 200,
      item: book,
      message: 'Get book detail success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not get book detail',
    })
  }
})

// Get Router
// Get list book for specify user
router.get('/', authCheck, async (req, res) => {
  try {
    // Find all book match with that user
    const books = await Book.find({
      user: req.user._id,
      status: req.query.status,
    }).sort('-createdAt')
    // check
    if (books) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found books',
      })
    }
    // return
    return res.json({
      result: 'success',
      status: 200,
      items: books,
      message: 'Get list book success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not get list book',
    })
  }
})

// Put router
// Edit book info
router.put('/:id', authCheck, async (req, res) => {
  try {
    const data = req.body
    // check input validaiton
    const { error } = inputBookValidation(data)
    if (error) {
      return res.json({
        result: 'fail',
        status: 500,
        error: error.details[0].message,
      })
    }
    // Find book match with that id
    const book = await Book.findOne({
      user: req.user._id,
      _id: req.params.id,
    })
    // check if exist or not
    if (!book) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any book match with that id',
      })
    }
    // change content
    book.title = data.title
    book.author = data.author
    book.rate = data.rate
    book.status = data.status ? data.status : 'new'
    book.review = data.review
    // save content
    const isSaveBook = await book.save()
    if (!isSaveBook) {
      return res.json({
        result: 'fail',
        status: 500,
        error: 'Could not save new book content',
      })
    }
    // return
    return res.json({
      result: 'success',
      status: 200,
      item: isSaveBook,
      message: 'Edit book success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not edit book',
    })
  }
})

// Delete router
// Delete book match with id
router.delete('/:id', authCheck, async (req, res) => {
  try {
    // Find book match with that id
    const book = await Book.findOne({
      user: req.user._id,
      _id: req.params.id,
    })
    // check if exist or not
    if (!book) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any book match with that id',
      })
    }
    // Delete book
    const isDeleteBook = await book.delete()
    if (!isDeleteBook) {
      return res.json({
        result: 'fail',
        status: 500,
        error: 'Could not delete book',
      })
    }
    // return
    return res.json({
      result: 'success',
      status: 200,
      message: 'Delete book success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not delete book',
    })
  }
})

// Post router
// Change status of a book
router.put('/:id', authCheck, async (req, res) => {
  try {
    const data = req.body
    if (!data.status) {
      return res.json({
        status: 500,
        error: 'Status field is required',
        result: 'fail',
      })
    }
    // Find book match with that id
    const book = await Book.findOne({
      user: req.user._id,
      _id: req.params.id,
    })
    // check if exist or not
    if (!book) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any book match with that id',
      })
    }
    // change status of book
    book.status = data.status
    // save book
    const isSaveBook = await book.save()
    if (!isSaveBook) {
      return res.json({
        result: 'fail',
        status: 500,
        error: 'Could not save new status',
      })
    }
    return res.json({
      result: 'success',
      status: 200,
      message: 'Change status success',
      item: isSaveBook,
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not change status',
    })
  }
})

module.exports = router
