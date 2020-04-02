import React, { Component } from 'react'
import apis from '../api';

export default class EditTodo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            todoId: props.todoId,
            todoName: props.todoName,
            timedGoal: props.timedGoal,
            finishedParts: props.finishedParts,
            partName: props.partName,
            partNameTemp: props.partName,
            allParts: props.allParts,
            partTime: props.partTime,
            sessionTime: props.sessionTime,
            totalTime: props.totalTime,
            hideEdit: props.hideEdit,
            reloadTodo: props.reloadTodo,
            reloadData: props.reloadData,
            updateArea: props.updateArea,
            sessionGoal: props.sessionGoal,
            partsForTimedGoals: props.partsForTimedGoals,
            focusTimeGoal: false,
            focusSessionTime: false,
        }
    }

    componentDidMount(){
        this.taskNameInput.focus();
    }

    handleSendData = async () => {
        const data = this.state;
        await apis.editTodo(data).then(response => {

        }).catch(err => {
            console.log(err)
        })
        this.state.hideEdit()
        this.state.reloadTodo()
    }

    onSubmit = () => {
        this.handleSendData()
    }

    deleteTask = async () => {
        const data = this.state;
        const config = {
            data: data
        }
        await apis.deleteTodo(config).then(response => {

        }).catch(err => {
            console.log(err)
        })
        this.state.hideEdit()
        this.state.reloadData()
        this.state.updateArea()
    }

    checKey = (e) => {
        if (e.key === "Enter") {
            this.onSubmit()
        }
    }

    handleInputName = (e) => {
        const value = e.target.value;
        this.setState({ todoName: value })
    }

    // Switch between normal goal and timed goal
    changeTimedGoalType = (e) => {
        let isTimedGoal = !this.state.timedGoal;
        let partNameTemp = this.state.partNameTemp;
        this.setState({ timedGoal: isTimedGoal })
        if (isTimedGoal) {
            this.setState({ partName: "Minutes" })
        } else {
            if (partNameTemp === "Minutes") {
                partNameTemp = "Parts";
            }
            this.setState({ partName: partNameTemp });
        }
    }

    handleInputPartName = (e) => {
        const value = e.target.value;
        this.setState({ partName: value, partNameTemp: value })
    }

    handleFinishedParts = (e) => {
        const value = e.target.value;
        this.setState({ finishedParts: value })
    }

    handleInputAllParts = (e) => {
        const value = parseInt(e.target.value);
        const timeCalc = value * this.state.partTime;
        const sessionForTimedCalc = value / this.state.sessionGoal
        this.setState({
            totalTime: timeCalc,
            allParts: value,
            partsForTimedGoals: sessionForTimedCalc
        })
    }

    handleInputSessionGoal = (e) => {
        const value = parseInt(e.target.value);
        const sessionTimeCalc = value * this.state.partTime;
        this.setState({
            sessionTime: sessionTimeCalc,
            sessionGoal: value
        })
        // If the sessiongoal is higher than the total goal increase the total goal
        if (value > this.state.allParts) {
            this.setState({
                allParts: value,
                totalTime: sessionTimeCalc
            });
        }
        if (this.state.timedGoal) {
            if (value > this.state.allParts) {
                this.setState({ partsForTimedGoals: 1 });
            } else {
                const calcPartsForTimedGoals = this.state.allParts / value;
                this.setState({ partsForTimedGoals: calcPartsForTimedGoals });
            }
        }
    }

    // Single Time input calculates
    // full Time for all Parts
    handleInputTime = (e) => {
        const value = parseInt(e.target.value);
        const calcTime = value * this.state.allParts;
        const calcSessionTime = value * this.state.sessionGoal;
        this.setState({
            totalTime: calcTime,
            sessionTime: calcSessionTime,
            partTime: value
        })
    }

    // Session Time
    handleInputSessionTime = (e) => {
        const value = parseInt(e.target.value);
        const calcPartTime = value / this.state.sessionGoal;
        const calcFullTime = calcPartTime * this.state.allParts;
        this.setState({
            partTime: calcPartTime,
            sessionTime: value,
            totalTime: calcFullTime
        })
    }

    // Full time input also calculates the 
    // time per part
    handleInputTotalTime = (e) => {
        const value = parseInt(e.target.value);
        const timeCalc = value / this.state.allParts;
        const sessionTimeCalc = timeCalc * this.state.sessionGoal
        this.setState({
            partTime: timeCalc,
            totalTime: value,
            sessionTime: sessionTimeCalc
        })
    }

    // FIXME check
    handlePartsForTimedGoals = (e) => {
        const value = parseInt(e.target.value);
        const calcPartTime = this.state.totalTime / value;
        this.setState({ partsForTimedGoals: value, sessionGoal: calcPartTime });
    }

    render() {
        return (
            // TODO changes after revamp of tasks
            <div className="editTodo">
                EDIT <i className="far fa-save icon" onClick={this.onSubmit} />
                <i className="far fa-trash-alt icon" onClick={this.deleteTask} />
                {/* Name, goaltype */}
                <p>
                    {!this.state.timedGoal && <i className="fas fa-slash inactive"></i>}
                    <i className={`fas fa-clock timeCheck ${this.state.timedGoal ? "active" : "inactive"}`}
                        onClick={this.changeTimedGoalType} />
                    <input name="todoName"
                        ref={(input)=>{this.taskNameInput = input;}}
                        className="todoName"
                        placeholder="Taskname"
                        autoComplete="off"
                        style={{ width: "81%" }}
                        value={this.state.todoName}
                        onChange={this.handleInputName}
                        onKeyDown={this.checKey} />

                </p>
                {/* Task goal, progress */}
                <p>
                    <i className="fas fa-trophy"></i>
                    {/* TODO finished parts shouldnt be higher than all parts */}
                    <input name="partNumber"
                        type="number"
                        autoComplete="off"
                        style={{ width: "19%" }}
                        value={this.state.finishedParts}
                        onChange={this.handleFinishedParts}
                        onKeyDown={this.checKey} />
                    /
                    <input name="allParts"
                        type="number"
                        className={`${(this.state.focusTimeGoal && !this.state.timedGoal) ? "focus" : null}`}
                        autoComplete="off"
                        style={{ width: "19%" }}
                        value={this.state.allParts}
                        onChange={this.handleInputAllParts}
                        onKeyDown={this.checKey}
                        onFocus={() => this.setState({ focusTimeGoal: true })}
                        onBlur={() => this.setState({ focusTimeGoal: false })} />

                    {this.state.timedGoal ?
                        <label>{this.state.partName}</label>
                        :
                        <input name="partName"
                            autoComplete="off"
                            style={{ width: "30%" }}
                            value={this.state.partName}
                            onChange={this.handleInputPartName}
                            onKeyDown={this.checKey} />

                    }
                </p>
                {/* Sessiongoal */}
                <p>
                    <i className="fas fa-puzzle-piece" />
                    <input name="sessionGoal"
                        autoComplete="off"
                        type="number"
                        min="1"
                        style={{ width: "19%" }}
                        className={`${this.state.focusSessionTime ? "focus" : null}`}
                        value={this.state.sessionGoal}
                        onChange={this.handleInputSessionGoal}
                        onKeyDown={this.checKey}
                        onFocus={() => this.setState({ focusSessionTime: true })}
                        onBlur={() => this.setState({ focusSessionTime: false })}
                    />
                    <label>{this.state.partName}</label>
                </p>

                {/* Time Information for normal Goal */}
                {!this.state.timedGoal &&
                    <p>
                        <i className="fas fa-clock"></i>
                        <input
                            min="0"
                            name="partTime"
                            type="number"
                            autoComplete="off"
                            style={{ width: "19%", marginLeft: "5px" }}
                            value={this.state.partTime}
                            onChange={this.handleInputTime}
                            onKeyDown={this.checKey} />
                        <input
                            id="sessionTimeInput"
                            type="number" name="totalTime" placeholder="totalTime" min="0"
                            // TODO: ERROR CHECKING
                            autoComplete="off"
                            style={{ width: "19%" }}
                            className={`${this.state.focusSessionTime ? "focus" : null}`}
                            value={this.state.sessionTime}
                            onChange={this.handleInputSessionTime}
                            onKeyDown={this.checKey}
                            onFocus={() => this.setState({ focusSessionTime: true })}
                            onBlur={() => this.setState({ focusSessionTime: false })}
                        />
                        <input name="totalTime"
                            type="number"
                            className={`${this.state.focusTimeGoal ? "focus" : null}`}
                            autoComplete="off"
                            style={{ width: "22%" }}
                            value={this.state.totalTime}
                            onChange={this.handleInputTotalTime}
                            onKeyDown={this.checKey}
                            onFocus={() => this.setState({ focusTimeGoal: true })}
                            onBlur={() => this.setState({ focusTimeGoal: false })} />
                        <label style={{ paddingLeft: "1px" }}>min</label>
                    </p>
                }

                {/* Part information for timed Goal */}
                {this.state.timedGoal &&
                    <p>
                        <i className="fas fa-cut" style={{ marginRight: '8px' }} />
                        {/* TODO functionality for sesssioninput */}
                        <input type="number"
                            style={{ width: "19%" }}
                            value={this.state.partsForTimedGoals}
                            onChange={this.handlePartsForTimedGoals}
                            onKeyDown={this.checKey} />
                        <label>Sessions</label>
                    </p>
                }

            </div>
        )
    }
}
