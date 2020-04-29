const { AreaModel, TodoModel, ListModel, ArchiveModel } = require('../models/AreaModel');
const { deleteTodos, countTodosAndUpdate, deleteTodosFromActiveList, incompleteTodoCount } = require('../controller/todos')
const userId = "b6cb5d75-c313-4295-a28f-91541d6470d3"
const fixedId = "b6cb5d75-c313-4295-a28f-91541d6470d3"

//Create new Todo
const newTodo = async (req,res,next) => {

    let { todoName, parts, partName, time, totalTime, difficulty,
        timedGoal, sessionGoal, sessionTime,
        userId, areaId } = req.body;
    // FIXME LATER
    userId = "b6cb5d75-c313-4295-a28f-91541d6470d3"
    let color = await AreaModel.findOne({ _id: areaId }, { color: 1, _id: 0 })
    let newTodo = new TodoModel({
        todoName: todoName,
        allParts: parts,
        partName: partName,
        time: time,
        totalTime: totalTime,
        difficulty: difficulty,
        userId: userId,
        areaId: areaId,
        areaColor: color.color,
        timedGoal: timedGoal,
        sessionGoal: sessionGoal,
        sessionTime: sessionTime
    })
    newTodo.save()
        .then(response => {
            console.log(response)
            incompleteTodoCount(areaId)
            res.send({ msg: 'Saved Todo' })
        })
        .catch(err => {
            console.log(err)
            res.send({ msg: err })
        })
    AreaModel.findOneAndUpdate({ _id: areaId }, { $inc: { 'todoCount': 1 } })
        .then(response => {
            console.log(response)
        })
        .catch(err => {
            console.log(err)
            res.send({ msg: err })
        })

}

const getTodos = async (req,res,next) => {
    let { areaId } = req.body;
    let todoList = await TodoModel.find({ areaId: areaId }).sort({ "date": -1 })
    res.send(todoList)
}

const saveCurrentTodo = async (req,res,next) => {
    let user = userId; // Fixme Later
    let { todoId, state, partNumber, sessionGoal } = req.body;
    await ListModel.updateOne(
        { userId: user, "todos.todoId": todoId },
        {
            $set: {
                "todos.$.state": state,
                "todos.$.partNumber": partNumber,
                "todos.$.sessionGoal": sessionGoal
            }
        }
    )
    let todo = await TodoModel.findById(todoId)
    let finished = false;
    let tempSessionGoal = todo.sessionGoal;
    let goalDif = todo.allParts - partNumber;

    if(todo.sessionGoal > goalDif){
        tempSessionGoal = goalDif;
    }
    
    if (todo.allParts == partNumber) {
        finished = true
    }
    await todo.update({
        finishedParts: partNumber,
        sessionGoal: tempSessionGoal,
        finished: finished
    })
        .then(response => {
            console.log(response)
            incompleteTodoCount(todo.areaId)
            res.send({ msg: 'Updated Todo' })
        })
        .catch(err => {
            console.log(err)
            res.send({ msg: err })
        })
}

const countTodos = async (req,res,next) => {
    let { areaId } = req.body;
    let todoList = await TodoModel.find({ areaId: areaId })
    res.send(todoList.length)
}

const deleteTodo = async (req,res,next) => {
    let { todoId } = req.body;
    let area = await TodoModel.findById(todoId, { areaId: 1, _id: 0 })
    deleteTodos(todoId)
        .then(response => {
            countTodosAndUpdate(area.areaId)
            deleteTodosFromActiveList(userId, todoId)
            res.send({ msg: 'Todo deleted' })
        })
        .catch(err => {
            res.send({ msg: err })
        })

}

const editTodo = async (req,res,next) => {
    let { todoId, todoName, finishedParts, allParts, partName,
        partTime, totalTime, difficulty, sessionGoal, sessionTime } = req.body;
    let userId = fixedId; // FIXME
    let finished = false;
    if (finishedParts >= allParts) {
        finished = true;
    } else {
        finished = false;
    }
    await TodoModel.findByIdAndUpdate({ _id: todoId }, {
        todoName: todoName,
        finishedParts: finishedParts,
        allParts: allParts,
        partName: partName,
        sessionGoal: sessionGoal,
        sessionTime: sessionTime,
        partTime: partTime,
        totalTime: totalTime,
        difficulty: difficulty,
        finished: finished
    })
    await ListModel.updateOne(
        { userId: userId, "todos.todoId": todoId },
        {
            $set: {
                "todos.$.state": finished,
                "todos.$.partNumber": finishedParts,
                "todos.$.sessionGoal": sessionGoal
            }
        })
        .then(response => {
            console.log(response)
            res.send("updated Todo")
        })
        .catch(err => {
            console.log(err)
            res.send({ msg: err })
        })
}

const getSingleTodo = async (req,res,next) => {
    let { todoId } = req.body;
    let singleTodo = await TodoModel.findById(todoId);
    res.send(singleTodo);
}

const archiveTodos = async (req,res,next) => {
        // let { finishedTodos } = req.body;
        let userId = fixedId // FIXME Later
        let finishedTodos = await TodoModel.find({
            userId: userId,
            finished: true
        })
        console.log("FINISHED TODOS", finishedTodos)
        let todoIds = []
        finishedTodos.forEach(todo => {
            todoIds.push(todo._id)
            countTodosAndUpdate(todo.areaId)
        });
        console.log("IDS")
        console.log("USERID", userId)
        deleteTodos(todoIds)
        await ArchiveModel.findOneAndUpdate({ userId: userId }, { $push: { todos: finishedTodos } }, {
            upsert: true
        })
            .then(response => {
                console.log(response)
                deleteTodosFromActiveList(userId, todoIds)
                res.send("Archived Todos!")
            })
            .catch(err => {
                console.log(err)
                res.send({ msg: err })
            })
}

const TodosRoutes = {
    newTodo,
    getTodos,
    saveCurrentTodo,
    countTodos,
    deleteTodo,
    editTodo,
    getSingleTodo,
    archiveTodos
}

module.exports = TodosRoutes;