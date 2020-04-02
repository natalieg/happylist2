import React, { Component } from 'react'
import apis from '../api'
import SingleTodo from './SingleTodo'
import Tooltip from '@material-ui/core/Tooltip'

export default class GenerateList extends Component {
    constructor() {
        super()

        this.state = {
            userTime: 60,
            userMaxTasks: 10,
            areas: [],
            activeAreas: [],
            todoList: [],
            currentTodoListCount: 0,
            isLoading: false,
            isDragging: false,
            hideComplete: false,
            showSettings: false,
            progress: 0,
            finTodos: 0,
            leftTodos: 0,
            timeLeft: 0,
            allTime: 0,
            tooltipToggleComplete: "",
        }
    }

    // Loads a saved list
    loadSavedList = async () => {
        await apis.getCurrentList().then(response => {
            let data = response.data[0]
            if (response.data[0] != null) {
                let tempTodos = [...data.todos]
                let tempFinished = 0;
                let tempAllTasks = 0;
                let tempTime = 0;
                let tempAllTime = 0;
                tempTodos.forEach(todo => {
                    tempAllTime = tempAllTime + todo.sessionTime;
                    tempAllTasks++
                    if (todo.state) {
                        tempFinished++
                    } else {
                        tempTime = tempTime + todo.sessionTime
                    }
                });
                //FIXME loeschen
                console.log("TEMPTODOLIST", tempTodos)
                if (tempTodos.length > 0) {
                    this.setState({
                        todoList: tempTodos,
                        hideComplete: data.hideComplete,
                        showSettings: data.showSettings,
                        userMaxTasks: data.maxNumber,
                        currentTodoListCount: tempAllTasks,
                        finTodos: tempFinished,
                        timeLeft: tempTime,
                        allTime: tempAllTime,
                        tooltipToggleComplete: data.hideComplete ? "Show completed Tasks" : "Hide completed Tasks"
                    })
                }
            }
        })
        this.calcProgress()
    }

    // Loading Areas and saved Lists
    componentDidMount = async () => {
        this.setState({ isLoading: true })
        this.loadSavedList();
        await apis.getAreasWithoutEmpty().then(response => {
            let tempActive = [];
            response.data.forEach(element => {
                tempActive.push({
                    id: element._id,
                    state: true,
                    areaTitle: element.areaTitle,
                    color: element.color,
                    todoCount: element.incompleteTodoCount
                })
            });
            this.setState({
                areas: response.data,
                isLoading: false,
                activeAreas: tempActive
            })
        })
    }

    calcProgress = () => {
        let max = this.state.currentTodoListCount;
        let fin = this.state.finTodos;
        let calc = parseInt((fin / max) * 100)
        this.setState({ progress: calc })
    }

    toggleHideComplete = async () => {
        console.log("TOGGLE HIDE")
        const oldState = this.state.hideComplete;
        let temptip = ""
        if (oldState) {
            temptip = "Hide completed Tasks"
        } else {
            temptip = "Show completed Tasks"
        }
        this.setState({ hideComplete: !oldState, tooltipToggleComplete: temptip })
        let data = { hideComplete: !oldState }
        await apis.saveSettingForList(data).then(response => {
        }).catch(err => {
            console.log(err)
        })
    }

    toggleSettings = async () => {
        const oldState = this.state.showSettings;
        this.setState({ showSettings: !oldState })
        let data = { showSettings: !oldState }
        await apis.saveSettingForList(data).then(response => {
        }).catch(err => {
            console.log(err)
        })
    }

    /*
    Creating a new Todo List
    */
    createTodoList = async () => {
        this.setState({
            isLoading: true,
        })
        let areaIds = []
        this.state.activeAreas.forEach(area => {
            if (area.state) {
                areaIds.push(area.id)
            }
        });
        // Generate List and save data in DB
        await apis.generateList({
            areaIds: areaIds,
            showSettings: this.state.showSettings,
            maxNumber: this.state.userMaxTasks
        })
            .then(response => {
                let tempTodo = [];
                response.data.forEach(todo => {
                    tempTodo.push({
                        todoId: todo._id,
                        todoName: todo.todoName,
                        partNumber: todo.finishedParts,
                        allParts: todo.allParts,
                        partTime: todo.partTime,
                        partName: todo.partName,
                        color: todo.areaColor,
                        timedGoal: todo.timedGoal,
                        sessionGoal: todo.sessionGoal,
                        sessionTime: todo.sessionTime,
                        state: false
                    })
                    console.log("generatelist todo", todo)
                })
                this.setState({
                    todoList: []
                })
                this.setState({
                    todoList: tempTodo,
                    currentTodoListCount: tempTodo.length,
                    finTodos: 0,
                    progress: 0,
                    isLoading: false
                })
            })
    }

    /* Drag & Drop */
    onDragStart = (e, index) => {
        this.draggedItem = this.state.todoList[index];
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", e.target.parentNode);
        e.dataTransfer.setDragImage(e.target, 100, 20);
        this.setState({ isDragging: true })
    };

    onDragOver = index => {
        const draggedOverItem = this.state.todoList[index];

        // if the item is dragged over itself, ignore
        if (this.draggedItem === draggedOverItem) {
            return;
        }

        // filter out the currently dragged item
        let todoList = this.state.todoList.filter(item => item !== this.draggedItem);

        // add the dragged item after the dragged over item
        todoList.splice(index, 0, this.draggedItem);

        this.setState({ todoList });
    };

    onDragEnd = () => {
        this.draggedIdx = null;
        this.setState({ isDragging: false })

    };
    /////// End Drag & Drop

    //change Selected Areas
    changeActiveAreas = (e) => {
        let tempActive = this.state.activeAreas;
        var foundIndex = tempActive.findIndex(x => x.id === e.target.id);
        tempActive[foundIndex].state = !tempActive[foundIndex].state;
        this.setState({ activeAreas: tempActive })
    }

    handleInputTask = (e) => {
        const value = e.target.value;
        this.setState({ userMaxTasks: value })
    }

    handleInputTime = (e) => {
        const value = e.target.value;
        this.setState({ userTime: value })
    }

    render() {
        let allAreas = null;
        if (this.state.activeAreas.length > 0) {
            allAreas = this.state.activeAreas.map((area, index) => {
                return (
                    <div key={area.id}
                        className="selectArea"
                        style={{ backgroundColor: area.color }}>
                        <label>
                            <input type="checkbox"
                                onChange={this.changeActiveAreas}
                                checked={area.state} id={area.id} />
                            {area.areaTitle} : {area.todoCount}
                        </label></div>
                )
            })
        }
        let generatedList = null;
        if (this.state.todoList.length > 0) {
            generatedList = this.state.todoList.map((todo, index) => {
                if (this.state.hideComplete && todo.state) {
                    return null
                } else {
                    return (
                        <div className="dragContainer" key={todo.todoId} draggable
                            onDragOver={() => this.onDragOver(index)}
                            onDragStart={e => this.onDragStart(e, index)}
                            onDragEnd={this.onDragEnd}>
                            <SingleTodo
                                key={todo.todoId}
                                todoId={todo.todoId}
                                todoName={todo.todoName}
                                color={todo.color}
                                partNumber={todo.partNumber}
                                partName={todo.partName}
                                allParts={todo.allParts}
                                timedGoal={todo.timedGoal}
                                sessionGoal={todo.sessionGoal}
                                sessionTime={todo.sessionTime}
                                state={todo.state}
                                dragging={this.state.isDragging}
                                reloadList={this.loadSavedList}
                            />
                        </div>
                    )
                }

            })
        }

        return (
            <div className="list">
                <h1>Generate your List!</h1>
                <button onClick={this.createTodoList}>Create</button>
                <Tooltip className="tooltip" title="Settings" arrow placement="top">
                    <i className="fas fasSettings fa-cogs" onClick={this.toggleSettings}></i>
                </Tooltip>

                {this.state.showSettings &&
                    <div className="settings">
                        <div className="row">
                            {/* TODO show when functionality is actually implemented */}
                            {/* <div><label>Time</label></div> */}
                            <div><label>Tasks</label></div>
                        </div>
                        <div className="row">
                            {/* <div><input type="number" onChange={this.handleInputTime} value={this.state.userTime} /></div> */}
                            <div><input type="number" onChange={this.handleInputTask} value={this.state.userMaxTasks} /></div>
                        </div>
                        <div className="selectAreasDiv">
                            {allAreas}
                        </div>
                    </div>
                }
                <div draggable="false">
                    {this.state.currentTodoListCount > 0 ?
                        <div className="visibleListWrapper">
                            <Tooltip className="tooltip" title={this.state.tooltipToggleComplete} arrow placement="top">
                                <div onClick={this.toggleHideComplete}>
                                    {this.state.hideComplete ? <i className="fas fa-eye" /> : <i className="fas fa-eye-slash" />}
                                </div>
                            </Tooltip>
                            <div className="listStatus"><span>Tasks:
                            <b> {(this.state.currentTodoListCount - this.state.finTodos)}</b></span>
                                <span className="timeLeft"> Time Left: <b>{this.state.timeLeft}</b> Minutes</span>
                            </div>
                            <div className="progressWrapper">
                                <div className="progress"
                                    style={{ width: `${this.state.progress}%` }}
                                ></div>
                            </div>
                            <div className="generatedListWrapper">{generatedList}</div>
                        </div>
                        : null}
                </div>

                {/* TODO */}
                {/* <p>Priority</p> */}
            </div>
        )
    }
}
