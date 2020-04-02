import React, { Component } from 'react'
import NewTodo from './NewTodo'
import SingleTodoInArea from './SingleTodoInArea'
import apis from '../api'
import { CirclePicker as Circle } from 'react-color';

export default class SingleArea extends Component {
    constructor(props) {
        super(props)

        this.state = {
            area: {
                areaId: props.id,
                backgroundColor: props.color,
                className: props.className,
                areaName: props.name,
                btnValue: props.btnValue
            },
            tasks: [],
            taskcount: props.taskcount,
            newTodoVisible: false,
            newTodoCss: "test2_2",
            isLoading: false,
            updateAreas: props.updateAreas,
            hoverActive: false,
            editActive: false
        }
    }


    componentDidMount = async () => {
        this.setState({ isLoading: true })
        await apis.getAreaTodos({ areaId: this.state.area.areaId }).then(response => {
            this.setState({
                tasks: response.data,
                isLoading: false,
                init: false
            })
        })
    }

    componentDidUpdate() {
        if (this.state.editActive) {
            this.areaTitleInput.focus();
        }
    }

    handleLoadData = async () => {
        await apis.getAreaTodos({ areaId: this.state.area.areaId }).then(response => {
            // this.setState({ tasks: [] })
            this.setState({
                tasks: response.data,
                isLoading: false
            })
        })
    }

    checkTodos = () => {
        if (this.props.taskcount !== this.state.tasks.length) {
            this.handleLoadData()
        }
    }

    toggleNewTodo = () => {
        const isActive = this.state.newTodoVisible;
        this.setState({ newTodoVisible: !isActive });
    }

    toggleEditMode = () => {
        console.log("TOGGLE ACTIVE")
        const isActive = this.state.editActive;
        this.setState({ editActive: !isActive });
        if (!isActive) {
            console.log(`status is ${isActive}`)
            this.setState({ newTodoVisible: false });
        }
    }

    handleMouseOver = () => {
        this.setState({ hoverActive: true })
    }

    handleMouseOut = () => {
        this.setState({ hoverActive: false })
    }

    handleInputName = (e) => {
        const value = e.target.value;
        this.setState({ area: { ...this.state.area, areaName: value } })
    }

    handleClickColor = (color) => {
        console.log("COLOR CHANGE?")
        let rgba = `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},0.4)`
        this.setState({ area: { ...this.state.area, backgroundColor: rgba } })
    }

    handleInputColor = (e) => {
        this.setState({ area: { ...this.state.area, backgroundColor: e.target.value } })
    }

    checKey = (e) => {
        if (e.key === "Enter") {
            this.handleSendData()
        }
    }

    handleSendData = async () => {
        const data = this.state.area;
        await apis.editArea(data).then(response => {

        }).catch(err => {
            console.log(err)
        })
        this.setState({ editActive: false })
        this.handleLoadData()
    }

    deleteArea = async () => {
        let result = window.confirm("Do you want to delete the Area with all the Tasks?");
        if (result) {
            const config = {
                data: { areaId: this.state.area.areaId }
            }
            console.log("frontend data", config)
            await apis.deleteArea(config).then(response => {

            }).catch(err => {
                console.log(err)
            })
            this.setState({ editActive: false })
            this.state.updateAreas()
        }
    }

    render() {
        this.checkTodos()
        let displayTodos = this.state.tasks.map((todo, index) => {
            return <SingleTodoInArea
                key={todo._id}
                todo={todo}
                reloadData={this.handleLoadData}
                updateArea={this.state.updateAreas}
            />
        })

        return (
            <div className="singleAreaWrapper"
                onMouseEnter={this.handleMouseOver}
                onMouseLeave={this.handleMouseOut}>
                {(this.state.hoverActive || this.state.editActive) ?
                    <i className="far fa-edit editAreaIcon"
                        onClick={this.toggleEditMode} />
                    : null}
                {!this.state.editActive &&
                    <div id={this.state.area.areaId}
                        key={this.state.area.areaId}
                        style={{ backgroundColor: this.state.area.backgroundColor }}
                        className={this.state.area.className}
                    >
                        <div className="singleAreaUpper">
                            <h2>{this.state.area.areaName}</h2>
                            {/* FIXME props taskcount works but not state taskcount ??? */}
                            <p className='areaSummary'>Tasks: {this.props.taskcount}</p>
                            <button value={this.state.area.btnValue}
                                onClick={this.toggleNewTodo}>
                                {this.state.newTodoVisible ? <i className="fas fa-minus"/> :  <i className="fas fa-plus"/>}
                                Task</button>
                        </div>
                        <div className="newTodoArea">
                            {this.state.newTodoVisible ?
                                <NewTodo divClass={this.state.newTodoCss}
                                    areaId={this.state.area.areaId}
                                    reloadTodo={this.handleLoadData}
                                    updateAreas={this.state.updateAreas}
                                />
                                : null}
                        </div>
                        <div className='todoItemContainer'>
                            {this.state.tasks.length > 0 ?
                                <>{displayTodos}</>
                                : "No Tasks!"}
                        </div>
                    </div>
                }
                {this.state.editActive &&
                    <div className={`${this.state.area.className} editSingleArea`} style={{ backgroundColor: this.state.area.backgroundColor }}>
                        <input
                            ref={(input) => { this.areaTitleInput = input; }}
                            value={this.state.area.areaName}
                            className="editAreaName"
                            onKeyDown={this.checKey}
                            onChange={this.handleInputName}
                        />
                        <Circle
                            className="colorPicker"
                            color={this.state.area.backgroundColor}
                            onChangeComplete={this.handleClickColor}
                        />
                        <input
                            name="color"
                            type="text"
                            value={this.state.area.backgroundColor}
                            onChange={this.handleInputColor}
                            placeholder="Area Color"
                        /><br />
                        <button onClick={this.handleSendData}>Save</button>
                        <button onClick={this.deleteArea}>Delete</button>
                    </div>
                }
            </div>
        )
    }
}

