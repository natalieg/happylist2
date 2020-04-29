const { TodoModel, ListModel } = require('../models/AreaModel');
const { generateList } = require('../controller/generateList')
const userId = "b6cb5d75-c313-4295-a28f-91541d6470d3"
const fixedId = "b6cb5d75-c313-4295-a28f-91541d6470d3"


const genList = async (req,res,next) =>{
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
}

const saveSettingsList = async (req,res,next) => {
    let { showSettings, hideComplete } = req.body;
    console.log("hi")
    let userId = fixedId //FIXME 
    await ListModel.findOneAndUpdate({ userId: userId }, {
        showSettings: showSettings,
        hideComplete: hideComplete
    })
}

const getCurrentList = async (req,res,next) => {
    let list = await ListModel.find({ userId: userId })
    .then(response => {
        // console.log(response)
        res.send(response)
    })
    .catch(err => {
        console.log(err)
        res.send({ msg: err })
    });
}

const ListRoutes = {
    genList,
    saveSettingsList,
    getCurrentList
}

module.exports = ListRoutes;