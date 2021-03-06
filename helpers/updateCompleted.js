// import model
const Goal = require('../Models/Goal')
const Objective = require('../Models/Objective')
const Strategy = require('../Models/Strategy')
const Tatic = require('../Models/Tatic')

const reCountWhenChangeObjective = async goalId => {
  try {
    // find goal match with that objective
    const goal = await Goal.findById(goalId)
    if (!goal) throw new Error()
    // Recount percent for that goal
    const objectives = await Objective.find({
      goal: goal._id,
    })
    if (!objectives) throw new Error()
    let goalPercent = 0
    objectives.forEach(ob => {
      goalPercent += ob.perCent / objectives.length
    })
    goal.perCent = goalPercent
    const isSaveGoal = await goal.save()
    if (!isSaveGoal) throw new Error()
    return true
  } catch (error) {
    return null
  }
}

const reCountWhenChangeStrategy = async objId => {
  try {
    // Find objectives match with that strategy
    const objective = await Objective.findById(objId)
    if (!objective) throw new Error()
    // Recount percent for that objective
    const strategies = await Strategy.find({
      objective: objective._id,
    })
    if (!strategies) throw new Error()
    let objPercent = 0
    strategies.forEach(str => {
      objPercent += str.perCent / strategies.length
    })
    objective.perCent = objPercent
    const isSaveObj = await objective.save()
    if (!isSaveObj) throw new Error()
    // recount percent for that goal
    let reCountGoal = await reCountWhenChangeObjective(isSaveObj.goal)
    if (!reCountGoal) throw new Error()
    return true
  } catch (error) {
    return null
  }
}

const reCountWhenChangeTatic = async straId => {
  try {
    const strategy = await Strategy.findById(straId)
    if (!strategy) throw new Error()
    // Recount percent for this strategy
    const tatics = await Tatic.find({
      strategy: strategy._id,
    })
    if (!tatics) throw new Error()
    let strPercent = 0
    tatics.forEach(tatic => {
      strPercent +=
        (tatic.completedAction / tatic.totalAction / tatics.length) * 100
    })
    strategy.perCent = strPercent
    const isSaveStr = await strategy.save()
    if (!isSaveStr) throw new Error()
    // Recount objective
    const reCountObjective = await reCountWhenChangeStrategy(strategy.objective)
    if (!reCountObjective) throw new Error()
    return true
  } catch (error) {
    return null
  }
}

module.exports = {
  recountGoal: reCountWhenChangeObjective,
  recountObjective: reCountWhenChangeStrategy,
  recountStrategy: reCountWhenChangeTatic,
}
