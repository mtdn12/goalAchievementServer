const router = require("express").Router();

// Import Model
const DailyTodo = require("../../Models/DailyToDo");

// Import middlewares
const authCheck = require("../../middlewares/checkAuthen");

// Import validations
const inputTodoValidation = require("../../validation/todoInput");

// Router get list todo
router.get("/", authCheck, async (req, res) => {
  try {
    const todos = await DailyTodo.find({
      user: req.user._id,
      isActive: true
    });
    if (!todos) {
      return res.json({
        result: "fail",
        status: 404,
        error: "Could not found any task"
      });
    }
    return res.json({
      result: "success",
      status: 200,
      items: todos,
      message: "Get list todo success"
    });
  } catch (error) {
    return res.json({
      result: "fail",
      status: 400,
      error: "Could not get list todo"
    });
  }
});
// Router create new daily todo
router.post("/", authCheck, async (req, res) => {
  try {
    const data = req.body;
    // Check validation
    const { error } = inputTodoValidation(data);
    if (error) {
      return res.json({
        result: "fail",
        status: 500,
        error: error.details[0].message
      });
    }
    console.log(req.user);
    // Create new todo
    const todo = new DailyTodo({
      user: req.user._id,
      todo: data.todo
    });
    // Save new todo
    const isSaveTodo = await todo.save();
    // Check save success or not then return result
    if (!isSaveTodo) {
      return res.json({
        result: "fail",
        status: 500,
        error: "Could not save new task"
      });
    }
    return res.json({
      result: "success",
      status: 200,
      item: isSaveTodo,
      message: "Create new task success"
    });
  } catch (error) {
    console.log(error);
    return res.json({
      result: "fail",
      status: 400,
      error: "Could not create new task"
    });
  }
});
// Router Edit daily todo
router.put("/:id", authCheck, async (req, res) => {
  try {
    const data = req.body;
    // Check validation
    const { error } = inputTodoValidation(data);
    if (error) {
      return res.json({
        result: "fail",
        status: 500,
        error: error.details[0].message
      });
    }
    // Find todo match with that id
    const todo = await DailyTodo.findOne({
      user: req.user._id,
      _id: req.params.id
    });
    if (!todo) {
      return res.json({
        result: "fail",
        status: 404,
        error: "Could not found any task match that id"
      });
    }
    // Change todo
    todo.todo = data.todo;
    // save new todo
    const isSaveTodo = await todo.save();
    // Check save success or not then return result
    if (!isSaveTodo) {
      return res.json({
        result: "fail",
        status: 500,
        error: "Could not save new task"
      });
    }
    return res.json({
      result: "success",
      status: 200,
      item: isSaveTodo,
      message: "Edit task success"
    });
  } catch (error) {
    return res.json({
      result: "fail",
      status: 400,
      error: "Could not edit task"
    });
  }
});

// Router delete daily Todo
router.delete("/:id", authCheck, async (req, res) => {
  try {
    // Find todo match with that id
    const todo = await DailyTodo.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    if (!todo) {
      return res.json({
        result: "fail",
        status: 404,
        error: "Could not found any task match that id"
      });
    }
    // Delete that todo and w8
    // const isDelete = await todo.delete();
    // Update this todo active to be false so it still save in the database to Check in historyss
    todo.isActive = false;
    const isSave = await todo.save();
    if (!isSave) {
      return res.json({
        result: "fail",
        status: 500,
        error: "Could not delete this task"
      });
    }
    return res.json({
      result: "success",
      status: 200,
      message: "Delete task success"
    });
  } catch (error) {
    return res.json({
      result: "fail",
      error: "Could not delete this task",
      status: 400
    });
  }
});

module.exports = router;
