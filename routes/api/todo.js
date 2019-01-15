const router = require('express').Router()

// Import Model
const Todo = require('../../Models/ToDo')

// Import middlewares
const authCheck = require('../../middlewares/checkAuthen')

// Import validations
const inputTodoValidation = require('../../validation/todoInput')

// Router get list todo
router.get('/', authCheck, async (req, res) => {
  try {
    const todos = await Todo.find({
      user: req.user._id,
    })
    if (!todos) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any task',
      })
    }
    return res.json({
      result: 'success',
      status: 200,
      items: todos,
      message: 'Get list todo success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not get list todo',
    })
  }
})
// Router create new todo
router.post('/', authCheck, async (req, res) => {
  try {
    const data = req.body
    // Check validation
    const { error } = inputTodoValidation(data)
    if (error) {
      return res.json({
        result: 'fail',
        status: 500,
        error: error.details[0].message,
      })
    }
    // Create new todo
    const todo = new Todo({
      user: req.user._id,
      todo: data.todo,
    })
    // Save new todo
    const isSaveTodo = await todo.save()
    // Check save success or not then return result
    if (!isSaveTodo) {
      return res.json({
        result: 'fail',
        status: 500,
        error: 'Could not save new task',
      })
    }
    return res.json({
      result: 'success',
      status: 200,
      item: isSaveTodo,
      message: 'Create new task success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not create new task',
    })
  }
})
// Router Edit todo
router.put('/:id', authCheck, async (req, res) => {
  try {
    const data = req.body
    // Check validation
    const { error } = inputTodoValidation(data)
    if (error) {
      return res.json({
        result: 'fail',
        status: 500,
        error: error.details[0].message,
      })
    }
    // Find todo match with that id
    const todo = await Todo.findOne({
      user: req.user._id,
      _id: req.params.id,
    })
    if (!todo) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any task match that id',
      })
    }
    // Change todo
    todo.todo = data.todo
    // save new todo
    const isSaveTodo = await todo.save()
    // Check save success or not then return result
    if (!isSaveTodo) {
      return res.json({
        result: 'fail',
        status: 500,
        error: 'Could not save new task',
      })
    }
    return res.json({
      result: 'success',
      status: 200,
      item: isSaveTodo,
      message: 'Edit task success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not edit task',
    })
  }
})

// Router delete Todo
router.delete('/:id', authCheck, async (req, res) => {
  try {
    // Find todo match with that id
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
    if (!todo) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any task match that id',
      })
    }
    // Delete that todo and w8
    const isDelete = await todo.delete()
    if (!isDelete) {
      return res.json({
        result: 'fail',
        status: 500,
        error: 'Could not delete this task',
      })
    }
    return res.json({
      result: 'success',
      status: 200,
      message: 'Delete task success',
    })
  } catch (error) {
    return res.json({
      result: 'fail',
      error: 'Could not delete this task',
      status: 400,
    })
  }
})
// Check a task
router.post('/check/:id', authCheck, async (req, res) => {
  try {
    // Find that task match with id
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
    if (!todo) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any task match that id',
      })
    }
    // Check task
    todo.isComplete = true
    // save new task
    const isSaveTodo = await todo.save()
    // Check save success or not then return result
    if (!isSaveTodo) {
      return res.json({
        result: 'fail',
        status: 500,
        error: 'Could not save new task',
      })
    }
    return res.json({
      result: 'success',
      status: 200,
      item: isSaveTodo,
      message: 'Check task success',
    })
    // return result
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not check this task',
    })
  }
})
// Uncheck a task
router.post('/uncheck/:id', authCheck, async (req, res) => {
  try {
    // Find that task match with id
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
    if (!todo) {
      return res.json({
        result: 'fail',
        status: 404,
        error: 'Could not found any task match that id',
      })
    }
    // Check task
    todo.isComplete = false
    // save new task
    const isSaveTodo = await todo.save()
    // Check save success or not then return result
    if (!isSaveTodo) {
      return res.json({
        result: 'fail',
        status: 500,
        error: 'Could not save new task',
      })
    }
    return res.json({
      result: 'success',
      status: 200,
      item: isSaveTodo,
      message: 'unCheck task success',
    })
    // return result
  } catch (error) {
    return res.json({
      result: 'fail',
      status: 400,
      error: 'Could not uncheck this task',
    })
  }
})

module.exports = router
