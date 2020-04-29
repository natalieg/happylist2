const { AreaModel, TodoModel  } = require('../models/AreaModel');
const fixedId = "b6cb5d75-c313-4295-a28f-91541d6470d3"



const getAreas = async (req,res,next) =>{

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

}

const newArea = (req,res,next) => {
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
}

const editArea = async (req,res,next) =>{
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
}

const deleteArea = async (req,res,next) =>{
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
}

const areasNotEmpty = async (req,res,next) => {
    //FIXME Later
    let userId = fixedId;
    let fullAreaIds = await TodoModel.find({ userId: userId, finished: false }, { areaId: 1, _id: 0 }).distinct("areaId");
    let fullAreas = await AreaModel.find({ _id: fullAreaIds })
    res.send(fullAreas)
}

const AreasRoutes = {
    getAreas,
    newArea,
    editArea,
    deleteArea,
    areasNotEmpty
}

module.exports = AreasRoutes;