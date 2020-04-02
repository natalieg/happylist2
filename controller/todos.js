const { TodoModel, AreaModel, ListModel } = require('../models/AreaModel');


const deleteTodos = async (todoIds) => {
    await TodoModel.deleteMany({ _id: { $in: todoIds } })
}

const deleteTodosFromActiveList = async (userId, todoIds) => {
    await ListModel.update(
        {userId: userId},
        {$pull: {"todos": {todoId: {$in: todoIds}}}}
    )
}

const countTodosAndUpdate = async (areaId) => {
    let todos = await TodoModel.find({ areaId: areaId });
    let todoCount = todos.length;
    await AreaModel.findByIdAndUpdate(areaId, { todoCount: todoCount })
}

const incompleteTodoCount = async(areaId)=> {
    let todos = await TodoModel.find({ areaId: areaId, finished: false });
    let todoCount = todos.length;
    await AreaModel.findByIdAndUpdate(areaId, {incompleteTodoCount: todoCount})
}


module.exports = { deleteTodos, countTodosAndUpdate, 
    deleteTodosFromActiveList, incompleteTodoCount }