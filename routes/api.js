var express = require('express');
var router = express.Router();
const AreasRouter = require('../middleware/areas');
const TodosRouter = require('../middleware/todos');
const ListRouter = require('../middleware/list');
const UserRouter = require('../middleware/user');

/* TODO Get Areas from DB
 Get Areas for Logged in User
 TODO: Right now we are using a {dummyUser} for the User 
 it will be changed to a Logged in User once we have a 
 Login Function
 */
router.get('/areas', AreasRouter.getAreas)

// Create New User
router.post('/newUser', UserRouter.newUser)

// Create new Area
router.post('/newArea', AreasRouter.newArea)

//Edit an Area
router.post('/editArea', AreasRouter.editArea)

// Delete Area
router.delete('/deleteArea', AreasRouter.deleteArea)

// Create new ToDo
router.post('/newTodo', TodosRouter.newTodo)

// Load all Todos for one Area
router.post('/getTodos', TodosRouter.getTodos)

//Generate List for chosen Areas
router.post('/generateList', ListRouter.genList)

//Save current Todo
router.post('/saveCurrentTodo', TodosRouter.saveCurrentTodo)

// Save Setting for Userlist
router.post('/saveSettingForList', ListRouter.saveSettingsList)

//Load current generated List
router.get('/getCurrentList', ListRouter.getCurrentList)

//Generate List without empty Areas
router.get('/getAreasWithoutEmpty', AreasRouter.areasNotEmpty)

//Count all Todos in Area
router.post('/countTodos', TodosRouter.countTodos)

// Delete a specific Todo (using id)
router.delete('/deleteTodo', TodosRouter.deleteTodo)

// Edit a specific Todo(using id)
router.post('/editTodo', TodosRouter.editTodo)

router.post('/getSingleTodo', TodosRouter.getSingleTodo)

// Archive finished Todos
router.post('/archiveTodos', TodosRouter.archiveTodos)



module.exports = router;