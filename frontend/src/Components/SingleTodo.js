import React from 'react'
import PieChart from 'react-minimal-pie-chart';
import apis from '../api'

export default class SingleTodo extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            id: props.todoId,
            todoName: props.todoName,
            color: props.color,
            state: props.state,
            partNumber: props.partNumber,
            partName: props.partName,
            allParts: props.allParts,
            timedGoal: props.timedGoal,
            sessionGoal: props.sessionGoal,
            sessionTime: props.sessionTime,
            todoClassName: '',
            dragging: props.dragging,
            changeState: props.changeState,
            reloadList: props.reloadList,
            hoverActive: false,
            goalIncrease: true,
            goalDecrease: true
        }
    }


    changeTodoState = (e) => {
        const value = e.target.checked;
        const partNumber = value ? this.state.partNumber + this.state.sessionGoal : this.state.partNumber - this.state.sessionGoal;
        console.log("CHANGE TODO STATE partnumber", partNumber, "sesisongoal ", this.state.sessionGoal)
        if (partNumber >= this.state.allParts) {
            this.setState({ goalIncrease: false })
        }
        if (partNumber <= 0) {
            this.setState({ goalDecrease: false })
        }
        const data =
        {
            todoId: this.state.id,
            state: value,
            partNumber: partNumber,
            sessionGoal: this.state.sessionGoal,
        }
        this.saveInDb(data);
        this.setState({
            state: value,
            partNumber: partNumber
        })
    }

    saveInDb = async (data) => {
        await apis.saveCurrentTodo(data)
            .then(response => {

            }).catch(err => {
                console.log(err)
            })
        this.state.reloadList()
    }

    handleMouseOver = (e) => {
        this.setState({ hoverActive: true })
    }

    handleMouseOut = (e) => {
        this.setState({ hoverActive: false })
    }

    increaseTaskNumber = () => {
        this.updateTaskNumber(this.state.sessionGoal)
    }

    decreaseTaskNumber = () => {
        this.updateTaskNumber(- this.state.sessionGoal)
    }

    updateTaskNumber = (value) => {
        let tempPart = this.state.partNumber + value
        let tempState = this.state.state;
        this.setState({ partNumber: tempPart })
        if (tempPart === this.state.allParts) {
            tempState = true;
        }
        if (tempPart <= 0) {
            tempPart = 0
        }
        this.setState({ state: tempState })
        let data = {
            todoId: this.state.id,
            state: tempState,
            partNumber: tempPart
        }
        this.saveInDb(data)
    }

    increaseSessionGoal = () => {
        const sessionGoalIncr = this.state.sessionGoal + 1
        const partNumberIncr = this.state.partNumber + 1;
        this.setState({ sessionGoal: sessionGoalIncr, partNumber: partNumberIncr })
        if (partNumberIncr >= this.state.allParts) {
            this.setState({ goalIncrease: false })
        }
        if (sessionGoalIncr > 0){
            this.setState({goalDecrease: true})
        }
        console.log("goalincr", sessionGoalIncr)
        const data = {
            todoId: this.state.id,
            state: this.state.state,
            sessionGoal: sessionGoalIncr,
            partNumber: partNumberIncr
        }
        console.log("DATA", data)
        this.saveInDb(data);
    }


    decreaseSessionGoal = () => {
        const sessionGoalDec = this.state.sessionGoal - 1
        const partNumberDec = this.state.partNumber - 1;
        this.setState({ sessionGoal: sessionGoalDec, partNumber: partNumberDec, goalIncrease: true })
        const data = {
            todoId: this.state.id,
            state: this.state.state,
            sessionGoal: sessionGoalDec,
            partNumber: partNumberDec
        }
        if (sessionGoalDec <= 0) {
            this.setState({ goalDecrease: false });
        }
        this.saveInDb(data);
    }


    render() {
        return (
            <div className="singleTodoWrapper"
                onMouseEnter={this.handleMouseOver}
                onMouseLeave={this.handleMouseOut}>
                <div key={this.state.id} className="singleTodo"
                    tabIndex="0">
                    <input type="checkbox"
                        className="checkbox"
                        value={this.state.state}
                        checked={this.state.state}
                        onChange={this.changeTodoState} />
                    <label className={this.state.state ? "todoComplete" : "todoIncomplete"}>
                        <span className="todoLabel">{this.state.todoName}</span>
                        {/* FIXME remove the time later just for testing */}
                        <span className="sessionGoal">{this.state.sessionGoal} {this.state.partName}</span>
                    </label>
                    <span className="partDisplay">{this.state.partNumber}/{this.state.allParts}
                    </span>


                    {/* <div className="todoColorRef"
                    style={{ backgroundColor: this.state.color }}></div> */}
                    <PieChart
                        className="pieChart"
                        cx={50}
                        cy={50}
                        data={[
                            {
                                color: this.state.color,
                                title: 'One',
                                value: this.state.partNumber
                            },
                            {
                                color: "white",
                                title: 'Two',
                                value: this.state.allParts - this.state.partNumber
                            }
                        ]}
                        label={false}
                        lengthAngle={360}
                        lineWidth={100}
                        paddingAngle={0}
                        radius={50}
                        rounded={false}
                        startAngle={0}
                        style={{
                            height: '25px'
                        }}
                        viewBoxSize={[
                            20,
                            20
                        ]}
                    />

                </div>
                {(this.state.hoverActive && this.state.state) &&
                    <div className="flag">
                        <div className="arrow-left"></div>
                        <div className="flagContent">
                            <span className="sessionGoalSpan">+{this.state.sessionGoal}</span>
                        </div>
                        <div className="extra">
                            <span className="extraText">did more?</span>
                            <span className="extraBtns">
                                {this.state.goalIncrease &&
                                    <i className="fas fa-plus-square" onClick={this.increaseSessionGoal}></i>
                                }
                                {this.state.goalDecrease &&
                                    <i className="fas fa-minus-square" onClick={this.decreaseSessionGoal}></i>
                                }
                            </span>

                        </div>
                    </div>
                }

            </div>
        )
    }
}
