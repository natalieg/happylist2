var express = require('express');
var router = express.Router();
const { UserModel, AreaModel, TodoModel, ListModel, ArchiveModel } = require('../models/AreaModel');
const uuid = require('uuid');
const { generateList } = require('../controller/generateList')
const { deleteTodos, countTodosAndUpdate, deleteTodosFromActiveList, incompleteTodoCount } = require('../controller/todos')
const dummyUser = "User22";
const userId = "b6cb5d75-c313-4295-a28f-91541d6470d3"
const fixedId = "b6cb5d75-c313-4295-a28f-91541d6470d3"

/* TODO Get Areas from DB
 Get Areas for Logged in User
 TODO: Right now we are using a {dummyUser} for the User 
 it will be changed to a Logged in User once we have a 
 Login Function
 */
router.get('/areas', async (req, res, next) => {
    //Fixme Later
    let userId = fixedId;
    let allAreas = await AreaModel.find({ userId: userId }).sort({ "date": -1 })

    let todos = await TodoModel.find({ userId: userId }).sort({ "date": -1 })
    let areaWithTodo = allAreas.map(area => {
        let areaTodos = todos.filter(todo => {

            return todo.areaId === area._id.toString()
        })

        return { ...area.toObject(), todos: areaTodos };
    });

    res.send(areaWithTodo)
})

// Create New User
router.post('/newUser', (req, res, next) => {
    let { name, email, password, areas } = req.body;
    console.log(req.body)
    let newUser = new UserModel({
        id: uuid.v4(),
        name: name,
        email: email,
        password: password,
    })

    newUser.save()
        .then(response => {
            console.log(response)
            res.send({ msg: 'done' })
        })
        .catch(err => {
            console.log(err)
            res.send({ msg: err })
        })
})

// Create new Area
router.post('/newArea', (req, res, next) => {
    let { areaTitle, color, priority, userId } = req.body;
    // FIXME LATER
    userId = "b6cb5d75-c313-4295-a28f-91541d6470d3"
    let newArea = new AreaModel({
        areaTitle: areaTitle,
        color: color,
        priority: priority,
        userId: userId
    })
    newArea.save()
        .then(response => {
            console.log(response)
            res.send({ msg: 'Saved Area' })
        })
        .catch(err => {
            console.log(err)
            res.send({ msg: err })
        })
})

//Edit an Area
router.post('/editArea', async (req, res, next) => {
    let { areaId, areaName, backgroundColor } = req.body;
    console.log("EDIT", req.body)
    await AreaModel.findOneAndUpdate(
        { _id: areaId },
        {
            areaTitle: areaName,
            color: backgroundColor
        })
        .then(response => {
            console.log(response)
            res.send({ msg: 'Area Updated' })
        })
        .catch(err => {
            console.log(err)
            res.send({ msg: err })
        })
})


// Delete Area
router.delete('/deleteArea', async (req, res, next) => {
    let { areaId } = req.body;
    console.log("DELETE ID", areaId)
    console.log("BODY", req.body)
    await TodoModel.deleteMany({ areaId: areaId })
    await AreaModel.findByIdAndDelete(areaId)
        .then(response => {
            res.send({ msg: 'Area deleted' })
        })
        .catch(err => {
            res.send({ msg: err })
        })
})

// Create new ToDo
router.post('/newTodo', async (req, res, next) => {
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
})

// Load all Todos for one Area
router.post('/getTodos', async (req, res, next) => {
    let { areaId } = req.body;
    let todoList = await TodoModel.find({ areaId: areaId }).sort({ "date": -1 })
    res.send(todoList)
})

//Generate List for chosen Areas
router.post('/generateList', async (req, res, next) => {
    let { areaIds, maxNumber, showSettings, hideComplete } = req.body;
    let todoList = await TodoModel.find({ areaId: areaIds, finished: false });
    let generatedList = generateList(todoList, areaIds, maxNumber)

    let tempList = []
    generatedList.forEach(todo => {
        // TODO Sessiongoal should never be too high for the full goal
        // the sessiongoal should never be too high for the 
        // complete goal 
        const goalDif = todo.allParts - todo.finishedParts;
        let tempSessionGoal = todo.sessionGoal;
        if (todo.sessionGoal > goalDif) {
            tempSessionGoal = goalDif;
        }
        tempList.push({
            todoId: todo._id,
            todoName: todo.todoName,
            partNumber: todo.finishedParts,
            partName: todo.partName,
            allParts: todo.allParts,
            partTime: todo.partTime,
            color: todo.areaColor,
            timedGoal: todo.timedGoal,
            sessionGoal: tempSessionGoal,
            sessionTime: todo.sessionTime,
            state: false,
        })
    });
    let newList = {
        //FIXME LATER
        userId: userId,
        hideComplete: hideComplete,
        showSettings: showSettings,
        maxNumber: maxNumber,
        todos: tempList
    }
    ListModel.findOneAndUpdate({ userId: userId }, newList, {
        upsert: true
    })
        .then(response => {
            // console.log(response)
            res.send(generatedList)
        })
        .catch(err => {
            console.log(err)
            res.send({ msg: err })
        })
})

//Save current Todo
router.post('/saveCurrentTodo', async (req, res, next) => {
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
})

// Save Setting for Userlist
router.post('/saveSettingForList', async (req, res, next) => {
    let { showSettings, hideComplete } = req.body;
    console.log("hi")
    let userId = fixedId //FIXME 
    await ListModel.findOneAndUpdate({ userId: userId }, {
        showSettings: showSettings,
        hideComplete: hideComplete
    })
})

//Load current generated List
router.get('/getCurrentList', async (req, res, next) => {
    let list = await ListModel.find({ userId: userId })
        .then(response => {
            // console.log(response)
            res.send(response)
        })
        .catch(err => {
            console.log(err)
            res.send({ msg: err })
        });
})

//Generate List without empty Areas
router.get('/getAreasWithoutEmpty', async (req, res, next) => {
    //FIXME Later
    let userId = fixedId;
    let fullAreaIds = await TodoModel.find({ userId: userId, finished: false }, { areaId: 1, _id: 0 }).distinct("areaId");
    let fullAreas = await AreaModel.find({ _id: fullAreaIds })
    res.send(fullAreas)
})

//Count all Todos in Area
router.post('/countTodos', async (req, res, next) => {
    let { areaId } = req.body;
    let todoList = await TodoModel.find({ areaId: areaId })
    res.send(todoList.length)
})

// Delete a specific Todo (using id)
router.delete('/deleteTodo', async (req, res, next) => {
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
})

// Edit a specific Todo(using id)
router.post('/editTodo', async (req, res, next) => {
    let { todoId, todoName, finishedParts, allParts, partName,
        partTime, totalTime, difficulty } = req.body;
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
        time: partTime,
        totalTime: totalTime,
        difficulty: difficulty,
        finished: finished
    })
    await ListModel.updateOne(
        { userId: userId, "todos.todoId": todoId },
        {
            $set: {
                "todos.$.state": finished,
                "todos.$.partNumber": finishedParts
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
})

router.post('/getSingleTodo', async (req, res, next) => {
    let { todoId } = req.body;
    let singleTodo = await TodoModel.findById(todoId);
    res.send(singleTodo);
})

// Archive finished Todos
router.post('/archiveTodos', async (req, res, next) => {
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
})



module.exports = router;