import React, { Component } from 'react';

import apis from '../api'
import Areas from './Areas'
import GenerateList from './GenerateList'
import { Rnd } from "react-rnd";

const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
    background: "#f0f0f0",
    height: "150vh",
};

const styleRight = {

}

export default class MainView extends Component {
    state = {
        areaWidth: 450,
        listPositionLeft: 450,
        isLoading: false,
        areas: [],
        areasWithTodos: [],
        allTaskCount: 0,
    }

    // Loading Areas 
    componentDidMount = async () => {
        this.setState({ isLoading: true })
        await apis.getAreaList().then(response => {
            let tempAreas = response.data;
            let tempAreaWithTask = [];
            tempAreas.forEach(area => {
                if(area.incompleteTodoCount > 0){
                    tempAreaWithTask.push(area)
                }
            });
            this.setState({
                areas: tempAreas,
                areasWithTodos: tempAreaWithTask,
                isLoading: false
            })
            this.countTodosFunction();
        })
    }

    handleLoadData = async () => {
        console.log("handle load data in areas!")
        await apis.getAreaList().then(response => {
            let tempAreas = response.data;
            let tempAreaWithTask = [];
            tempAreas.forEach(area => {
                if(area.incompleteTodoCount > 0){
                    tempAreaWithTask.push(area)
                }
            });
            this.setState({
                areas: response.data,
                areasWithTodos: tempAreaWithTask,
                isLoading: false
            })
            this.countTodosFunction();
        })
    }

    countTodosFunction = () => {
        let countTodos = 0;
        this.state.areas.forEach(element => {
            countTodos += element.todos.length;
        });
        console.log("MOTHER counting todos", countTodos)
        this.setState({ allTaskCount: countTodos })
    }

    render() {
        console.log("MainView", this.state.areas)
        return (
            <div className="mainView">
                {/* TODO set min and max width */}
                {/* TODO responsive behavior for the areas <3 */}
                {/* Areas are rendered on this side of component */}
                <Rnd
                    style={style}
                    disableDragging={true}
                    default={{
                        x: 0,
                        y: 0,
                        width: this.state.areaWidth,
                    }}
                    minWidth={300}
                    maxWidth={"50%"}
                    enableResizing={{
                        top: false,
                        right: true,
                        bottom: false,
                        left: false,
                        topRight: false,
                        bottomRight: false,
                        bottomLeft: false,
                        topLeft: false
                    }}
                    onResize={(e, direction, ref, delta, position) => {
                        let positionString = ref.style.width;
                        // positionString = positionString.slice(0, -2)
                        this.setState({
                            areaWidth: ref.style.width,
                            listPositionLeft: positionString
                        });
                    }}>
                    <Areas
                        areas={this.state.areas}
                        taskCount={this.state.allTaskCount}
                        reloadAreas={this.handleLoadData} />
                </Rnd>
                <div style={{ left: this.state.listPositionLeft }} className='mainList'>
                    <GenerateList
                        areas={this.state.areasWithTodos}
                        taskCount={this.state.allTaskCount}
                    />
                </div>
            </div>
        )
    }
}
