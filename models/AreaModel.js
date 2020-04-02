const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const archiveSchema = new Schema({
    userId: {
        type: String,
        unique: true
    },
    todos: [
        {
            todoId: {
                type: String
            },
            todoName: {
                type: String
            },
            allParts: {
                type: Number
            },
            totalTime: {
                type: Number
            },
            color: {
                type: String
            },
            areaColor: {
                type: String,
                require: true
            },
            timedGoal: {
                type: Boolean,
                default: false
            },
           sessionGoal: {
                type: Number,
                default: 1
            },
            startDate: {
                type: Date
            },
            finDate: {
                type: Date,
                default: Date.now
            }
        }
    ]

})

const listSchema = new Schema({
    userId: {
        type: String,
        unique: true
    },
    hideComplete: {
        type: Boolean,
        default: false
    },
    showSettings: {
        type: Boolean,
        default: true
    },
    maxNumber: {
        type: Number,
        default: 10
    },
    todos: [
        {
            todoId: {
                type: String
            },
            todoName: {
                type: String
            },
            partNumber: {
                type: Number
            },
            partName: {
                type: String,
                default: "Part(s)"
            },
            allParts: {
                type: Number
            },
            sessionGoal: {
                type: Number,
                default: 1
            },
            sessionTime: {
                type: Number,
                default: 10
            },
            sessionGoalType: {
                type: String
            },
            partTime: {
                type: Number
            },
            state: {
                type: Boolean,
                default: false
            },
            color: {
                type: String
            }
        }
    ]

})

const todoSchema = new Schema({
    todoName: {
        type: String,
        require: true
    },
    timedGoal: {
        type: Boolean,
        default: false
    },
    allParts: {
        type: Number,
        default: 1
    },
    finishedParts: {
        type: Number,
        default: 0
    },
    partName: {
        type: String,
        default: "Part(s)"
    },
    sessionGoal: {
        type: Number,
        default: 1
    },
    partTime: {
        type: Number,
        default: 10
    },
    sessionTime: {
        type: Number,
        default: 10
    },
    totalTime: {
        type: Number,
        default: 10
    },
    difficulty: {
        type: Number,
    },
    date: {
        type: Date,
        default: Date.now
    },
    finished: {
        type: Boolean,
        default: false
    },
    areaColor: {
        type: String,
        default: "white"
    },
    areaId: {
        type: String,
        require: true
    },
    userId: {
        type: String,
        require: true
    }
})

const areaSchema = new Schema({
    areaTitle: {
        type: String
    },
    color: {
        type: String
    },
    priority: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    selected: {
        type: Boolean,
        default: true
    },
    incompleteTodoCount: {
        type: Number,
        default: 0
    },
    todoCount: {
        type: Number,
        default: 0
    },
    userId: {
        type: String,
        require: true
    }
})

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    }
})

const UserModel = mongoose.model('user', userSchema);
const AreaModel = mongoose.model('area', areaSchema);
const TodoModel = mongoose.model('todo', todoSchema);
const ListModel = mongoose.model('list', listSchema);
const ArchiveModel = mongoose.model('archive', archiveSchema);
module.exports = { UserModel, AreaModel, TodoModel, ListModel, ArchiveModel };