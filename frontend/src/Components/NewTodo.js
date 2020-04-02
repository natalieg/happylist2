import React, { Component } from 'react';
import apis from '../api';
import ErrorMessage from './message/ErrorMessage';
import Tooltip from '@material-ui/core/Tooltip'
import { withStyles } from '@material-ui/core/styles';

const background = "grey";
const fontCol = "white"

// FIXME LATER - better way to re-use styling
const LightTooltip = withStyles(theme => ({
    arrow: {
        color: background,
    },
    tooltip: {
        position: "relative",
        left: "10px",
        backgroundColor: background,
        color: fontCol,
        boxShadow: theme.shadows[1],
        fontSize: 16,
    },
}))(Tooltip);

const TimeGoalTip = withStyles(theme => ({
    arrow: {
        color: background,
    },
    tooltip: {
        position: "relative",
        top: "5px",
        left: "30px",
        backgroundColor: background,
        color: fontCol,
        boxShadow: theme.shadows[1],
        fontSize: 16,
    },
}))(Tooltip);

const TimeTip = withStyles(theme => ({
    arrow: {
        color: background,
    },
    tooltip: {
        position: "relative",
        left: "10px",
        backgroundColor: background,
        color: fontCol,
        boxShadow: theme.shadows[1],
        fontSize: 16,
    },
}))(Tooltip);

export default class NewTodo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            areaId: props.areaId,
            todoName: '',
            parts: 1,
            partName: "Parts",
            partNameCash: "Parts",
            sessionGoal: 1,
            time: 1,
            sessionTime: 1,
            totalTime: 1,
            partsForTimedGoals: 1,
            timedGoal: false,
            difficulty: '',
            divClass: "ani1",
            reloadTodo: props.reloadTodo,
            errors: {},
            errorText: "",
            numError: false,
            numErrorText: "",
            updateAreas: props.updateAreas,
            focusTimeGoal: false,
            focusSessionTime: false,

            loading: false,
        }
    }

    onSubmit = (e) => {
        const errors = this.validate(); // do not do enything else if we have errors 

        if (Object.keys(errors).length === 0) {
            this.setState({ loading: true });
            console.log('trying to transmit data');
            this.handleSendData()
        };
    };

    // TODO: check for the new input fields esp when its a timed goal
    // TODO check sessiongoal
    // TODO check sessiontime

    // TODO Timed Sessionminutes
    validate = () => {
        const data = this.state
        this.setState({ numError: false, numErrorText: "" })
        const errors = {}; // the errors var will be empty if we don`t have errors 
        let numErr = "" // String for the Number errors

        if (!data.todoName) errors.todoName = 'Name cannot be empty!';
        if (data.parts <= 0 || (data.parts % 1) !== 0) {
            errors.partsStr = 'Parts';
            numErr += 'Parts, '
        };
        if (data.sessionGoal <= 0 || (data.sessionGoal % 1) !== 0) {
            errors.sessionGoal = 'Sessiongoal';
            numErr += 'Sessiongoal, '
        }
        if (data.time <= 0 || (data.time % 1) !== 0) {
            errors.timeStr = 'Time ';
            numErr += 'Time, '
        }
        if (data.sessionTime <= 0 || (data.sessionTime % 1) !== 0) {
            errors.sessionTime = 'Sessiontime ';
            numErr += 'Sessiontime, '
        }
        if (data.totalTime <= 0 || (data.totalTime % 1) !== 0) {
            errors.totalTime = 'TotalTime'
            numErr += 'Total Time'
        };

        if (errors.partsStr || errors.timeStr || errors.totalTime || errors.sessionGoal || errors.sessionTime) {
            this.setState({ numError: true, numErrorText: numErr })
        }

        this.setState({ errors });
        return errors;
    };

    // setTimeout is necessary for the fadein to work
    componentDidMount() {
        this.taskTitleInput.focus();
        setTimeout(() => {
            this.setState({ divClass: "ani2" })
        }, 0
        )
    }

    handleInputName = (e) => {
        const value = e.target.value;
        this.setState({ todoName: value })
    }

    // Handles Input for Goalnumber, this can be
    // either a number of x or minutes
    handleInputParts = (e) => {
        const value = e.target.value;
        const timeCalc = value * this.state.time;
        const sessionCalc = parseInt(value / this.state.sessionGoal);
        this.setState({
            totalTime: timeCalc,
            parts: value,
            partsForTimedGoals: sessionCalc
        })
    }

    handleInputPartName = (e) => {
        const value = e.target.value;
        this.setState({ partName: value, partNameCash: value })
    }

    handleInputSessionGoal = (e) => {
        const value = parseInt(e.target.value);
        const sessionTimeCalc = value * this.state.time;
        this.setState({
            sessionTime: sessionTimeCalc,
            sessionGoal: value
        })
        if (value > this.state.parts) {
            this.setState({ parts: value, totalTime: sessionTimeCalc });
        }
        if (this.state.timedGoal) {
            if (value > this.state.parts) {
                this.setState({ partsForTimedGoals: 1 });
            } else {
                const calcPartsForTimedGoals = parseInt(this.state.parts / value);
                this.setState({ partsForTimedGoals: calcPartsForTimedGoals });
            }
        }
    }

    // Single Time input calculates
    // full Time for all Parts
    handleInputTime = (e) => {
        const value = parseInt(e.target.value);
        const calcTime = value * this.state.parts;
        const calcSessionTime = value * this.state.sessionGoal;
        this.setState({
            time: value,
            sessionTime: calcSessionTime,
            totalTime: calcTime
        })
    }

    // Session Time
    handleInputSessionTime = (e) => {
        const value = parseInt(e.target.value);
        const calcPartTime = value / this.state.sessionGoal;
        const calcFullTime = calcPartTime * this.state.parts;
        this.setState({
            time: calcPartTime,
            sessionTime: value,
            totalTime: calcFullTime
        })
    }

    // Full time input also calculates the 
    // time per part
    handleInputTotalTime = (e) => {
        const value = parseInt(e.target.value);
        const timeCalc = value / this.state.parts;
        const sessionTimeCalc = timeCalc * this.state.sessionGoal
        this.setState({
            time: timeCalc,
            sessionTime: sessionTimeCalc,
            totalTime: value
        })
    }

    handlePartsForTimedGoals = (e) => {
        const value = parseInt(e.target.value);
        const calcPartTime = this.state.totalTime / value;
        this.setState({ partsForTimedGoals: value, sessionGoal: calcPartTime });
    }

    handleInputDifficulty = (e) => {
        const value = e.target.value;
        this.setState({ difficulty: value })
    }

    changeTimedGoalType = (e) => {
        const value = e.target.checked;
        this.setState({ timedGoal: value });
        if (value) {
            const sessionCalc = this.state.parts / this.state.sessionGoal;
            this.setState({
                partName: "Minutes",
                time: 1,
                partsForTimedGoals: sessionCalc
            })
        } else {
            this.setState({
                partName: this.state.partNameCash
            })
        }
    }

    // sending and saving data to DB
    handleSendData = async () => {
        const data = this.state;
        await apis.sendNewTodo(data).then(response => {
            this.setState({
                todoName: '',
                // parts: 1,
                partName: "Parts",
                time: 10,
                // totalTime: 10,
                difficulty: ''
            })
        }).catch(err => {
            console.log(err)
        })
        this.state.reloadTodo()
        this.state.updateAreas()
    }

    checKey = (e) => {
        if (e.key === "Enter") {
            this.onSubmit()
        }
    }

    render() {
        return (
            <div className="newTodoWrap">
                <div className="errorMessages">
                    {this.state.errors.todoName &&
                        <ErrorMessage text={this.state.errors.todoName} />}
                    {this.state.numError ? `Please Check: ${this.state.numErrorText}` : null}
                </div>
                <div className={`${this.state.divClass} newTodo`}>

                    <input
                        id="taskNameInput"
                        ref={(input) => { this.taskTitleInput = input; }}
                        type="text" name="todoName" placeholder="Taskname"
                        className={`${this.state.errors.todoName ? "inputError" : null} taskNameInput`}
                        autoComplete="off"
                        value={this.state.todoName}
                        onChange={this.handleInputName}
                        onKeyDown={this.checKey} />

                    <p className="taskGoal">
                        {/* FIXME: STYLING */}
                        <LightTooltip title="Goal for this Task" arrow placement="left">
                            <span className="span">
                                <i className="fas fa-trophy"></i>
                                <input
                                    id="goalInput"
                                    type="number" name="parts" placeholder="parts" min="0"
                                    className={`${this.state.errors.partsStr ? "inputError" : null}
                                    ${this.state.focusTimeGoal ? "focus" : null}`}
                                    autoComplete="off"
                                    style={{ width: "20%" }}
                                    value={this.state.parts}
                                    onChange={this.handleInputParts}
                                    onKeyDown={this.checKey}
                                    onFocus={() => this.setState({ focusTimeGoal: true })}
                                    onBlur={() => this.setState({ focusTimeGoal: false })}
                                />
                                {this.state.timedGoal ?
                                    <label className="padlabel">{this.state.partName}</label> :
                                    <input
                                        id="partNameInput"
                                        type="text" name="partName" placeholder="partname"
                                        autoComplete="off"
                                        style={{ width: "30%" }}
                                        value={this.state.partName}
                                        onChange={this.handleInputPartName}
                                        onKeyDown={this.checKey} />
                                }
                            </span>
                        </LightTooltip>
                        <TimeGoalTip title="is it a time goal?" arrow placement="top-end">
                            <span>
                                <input id="timeGoalCheck"
                                    type="checkbox"
                                    className="checkbox"
                                    value={this.state.timedGoal}
                                    onChange={this.changeTimedGoalType}
                                />
                                <label htmlFor="timeGoalCheck"></label>
                            </span>
                        </TimeGoalTip>
                    </p>
                    <LightTooltip title="How much do you want to do in a session?" arrow placement="left">
                        <p>
                            <i className="fas fa-puzzle-piece" />
                            {/* TODO Validation */}
                            <input
                                id="sessionGoalInput"
                                name="sessionGoal"
                                type="number"
                                autoComplete="off"
                                min="0"
                                style={{ width: "20%" }}
                                className={`
                                ${this.state.errors.sessionGoal ? "inputError" : null}
                                ${this.state.focusSessionTime ? "focus" : null}`}
                                value={this.state.sessionGoal}
                                onChange={this.handleInputSessionGoal}
                                onKeyDown={this.checKey}
                                onFocus={() => this.setState({ focusSessionTime: true })}
                                onBlur={() => this.setState({ focusSessionTime: false })}
                            />
                            <label
                                className="padlabel"
                                style={{ width: "33%" }}
                                name="sessionGoalType">
                                {this.state.timedGoal ? "Minutes" : this.state.partName}
                            </label>
                        </p>
                    </LightTooltip>

                    {this.state.timedGoal ?
                        <p><i className="fas fa-cut" style={{ marginRight: '4px' }} />
                            <input
                                type="number"
                                min="0"
                                style={{ width: "20%" }}
                                value={this.state.partsForTimedGoals}
                                onChange={this.handlePartsForTimedGoals}
                            />
                            <label className="padlabel">Sessions</label>
                        </p>
                        :
                        <p className="time">
                            <TimeTip title={`Time per ${this.state.partName}`} arrow placement="top">
                                <span className="span">
                                    <i className="fas fa-clock"></i>
                                    <input
                                        id="timeInput"
                                        type="number" name="time" placeholder="time for part" min="0"
                                        className={`${this.state.errors.timeStr ? "inputError" : null} inputfix`}
                                        autoComplete="off"
                                        style={{ width: "20%" }}
                                        value={this.state.time}
                                        onChange={this.handleInputTime}
                                        onKeyDown={this.checKey} />
                                    {/* <label className="timeLabel">min</label> */}
                                </span>
                            </TimeTip>
                            <TimeTip title="Session Time" arrow placement="top">
                                <span>
                                    <input
                                        id="sessionTimeInput"
                                        type="number" name="totalTime" placeholder="totalTime" min="0"
                                        // TODO: ERROR CHECKING
                                        autoComplete="off"
                                        style={{ width: "20%" }}
                                        className={`
                                        ${this.state.errors.sessionTime ? "inputError" : null}
                                        ${this.state.focusSessionTime ? "focus" : null}`}
                                        value={this.state.sessionTime}
                                        onChange={this.handleInputSessionTime}
                                        onKeyDown={this.checKey}
                                        onFocus={() => this.setState({ focusSessionTime: true })}
                                        onBlur={() => this.setState({ focusSessionTime: false })}
                                    />
                                </span>
                            </TimeTip>
                            <TimeTip title="Overall Time" arrow placement="top">
                                <span>
                                    <input
                                        id="totalTimeInput"
                                        type="number" name="totalTime" placeholder="totalTime" min="0"
                                        className={`${this.state.errors.totalTime ? "inputError" : null}
                                    ${this.state.focusTimeGoal ? "focus" : null}`}
                                        autoComplete="off"
                                        style={{ width: "25%" }}
                                        value={this.state.totalTime}
                                        onChange={this.handleInputTotalTime}
                                        onKeyDown={this.checKey}
                                        onFocus={() => this.setState({ focusTimeGoal: true })}
                                        onBlur={() => this.setState({ focusTimeGoal: false })}
                                    />
                                    <label className="timeLabel">min</label>
                                </span>
                            </TimeTip>
                        </p>
                    }






                    {/* <input type="number" name="difficulty" placeholder="difficulty"
                    autocomplete="off"
                    value={this.state.difficulty}
                    onChange={this.handleInputDifficulty} /> */}
                    <button onClick={this.onSubmit} style={{ width: "50%" }}>Save</button>
                </div>
            </div>
        )
    }
}
