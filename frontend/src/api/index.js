import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/'
})

const getAreaList = () => api.get('/areas')
const getAreasWithoutEmpty = () => api.get('getAreasWithoutEmpty')
const sendNewArea = (data) => api.post('/newArea', data)
const sendNewTodo = (data) => api.post('/newTodo', data)
const getAreaTodos = (data) => api.post('/getTodos', data)
const countAreaTodos = (data) => api.post('/countTodos', data)
const editArea = (data) => api.post('/editArea', data)
const deleteArea = (data) => api.delete('./deleteArea', data)
const generateList = (data) => api.post('/generateList', data)
const saveSettingForList = (data) => api.post('/saveSettingForList', data)
const getCurrentList = (data) => api.get('./getCurrentList', data)
const saveCurrentTodo = (data) => api.post('./saveCurrentTodo', data)
const editTodo = (data) => api.post('./editTodo', data)
const deleteTodo = (data) => api.delete('./deleteTodo', data)
const archiveTodos = () => api.post('./archiveTodos')
const getSingleTodo = (data) => api.post('./getSingleTodo', data)

const apis = {
    getAreaList,
    getAreasWithoutEmpty,
    sendNewArea,
    sendNewTodo,
    getAreaTodos,
    countAreaTodos,
    editArea,
    deleteArea,
    generateList,
    saveSettingForList,
    getCurrentList,
    saveCurrentTodo,
    editTodo,
    deleteTodo,
    archiveTodos,
    getSingleTodo,
}

export default apis