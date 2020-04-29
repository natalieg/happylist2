
const { UserModel } = require('../models/AreaModel');
const uuid = require('uuid');




const newUser = (req,res,next) =>{
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
}

const UserRoutes = {
    newUser
}

module.exports = UserRoutes;