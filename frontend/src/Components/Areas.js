import React, { Component } from 'react';
import SingleArea from './SingleArea';
import NewArea from './NewArea';
import UpperView from './UpperView';
import apis from '../api'
import Areabar from './Navbar/Areabar';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'

//#Check Pre defined standard colors, maybe change position later
//const areaColors = ['rgba(168, 201, 226, 0.5)', 'rgba(190, 234, 202, 0.4)', 'rgba(245, 242, 189, 0.5)', 'rgba(232, 217, 201, 0.5)', 'rgba(247, 190, 196, 0.6)'];

export default class Areas extends Component {
    constructor(props) {
        super(props)
        this.state = {
            areas: [],
            reloadAreas: this.props.reloadAreas,
            isLoading: true,
            dummyCounter: 0,
            allTaskCount: 0,
            newAreaActive: false,
            areaActive: true,
            showInfo: false,
            testProp: props.testProp,
        }
    }

    static getDerivedStateFromProps(props, state) {
        return {
            areas: props.areas,  
            allTaskCount: props.taskCount     
        };
    }

    // Loading Areas 
    componentDidMount = async () => {
        let visited = localStorage["alreadyVisited"];
        if (visited) {
            this.setState({ showInfo: false })
            //do not view Popup
        } else {
            //this is the first time
            localStorage["alreadyVisited"] = true;
            this.setState({ showInfo: true });
        }
        console.log("CDM Areas", this.state.areas.length)
        this.setState({ isLoading: false });
    }

    addTodo = (event) => {
        let indexOfModule = event.target.value;
        let allareas = [...this.state.areas]; // create copy
        //remove me later more dummy data stuff
        this.setState({ dummyCounter: this.state.dummyCounter + 1 });
        // default add thing //#TODO add area that opens when you click here || Or change this button to input field maybe?
        allareas[indexOfModule].todos.unshift('new item ' + this.state.dummyCounter); // manipulate array of item
        this.setState({ areas: allareas });
    }

    //Archive Todos that are finished
    archiveFinishedTodos = async () => {
        apis.archiveTodos().then(response => {
            console.log("RELOAD")
            this.handleLoadData()
        }
        )
    }

    // Toggles if the form for New Area is visible or not
    toggleActive = () => {
        const visible = this.state.newAreaActive;
        this.setState({ newAreaActive: !visible })
    }

    //Toggle Visibility for Area Overview
    toggleAreaView = () => {
        const visible = this.state.areaActive;
        this.setState({ areaActive: !visible })
    }

    setNewInactive = () => {
        this.setState({ newAreaActive: false })
    }

    changeInfoDisplay = () => {
        this.setState({ showInfo: !this.state.showInfo })
    }

    render() {
        // Renders all Areas
        let displayareas = this.state.areas.map((area, index) => {
            let taskcount = this.state.areas[index].todos.length;
            return (
                <SingleArea id={this.state.areas[index]._id}
                    className='singleArea'
                    key={this.state.areas[index]._id}
                    btnValue={index}
                    updateAreas={this.state.reloadAreas}
                    color={area.color}
                    name={area.areaTitle}
                    taskcount={taskcount} />
            )
        })
        return (
            <Router>
                <div>
                    <UpperView areaCount={this.state.areas.length} allTodoCount={this.state.allTaskCount} />
                    {/* #TODO Otherwise show areas that already exist */}
                    <Areabar areaActive={this.state.areaActive}
                        nameArea={this.state.newAreaActive ? "Cancel New Area" : "Add Area"}
                        clickArea={this.toggleActive}
                        nameArchive="Archive Finished Tasks"
                        archiveTodos={this.archiveFinishedTodos}
                        changeInfoDisplay={this.changeInfoDisplay}
                    />
                    {this.state.showInfo &&
                        <div className="infoText">
                            Happylist helps you to gain a better Work-Life-Balance and to stop procrastinating!<br />
                            You can add different Areas for your life e.g. Health and Work and add Tasks to those Areas.<br />
                            After you filled your Areas you can create a new todo list.
                            Have fun playing around!
                            <input type="button" value="OK" onClick={this.changeInfoDisplay}></input>
                            <span style={{ fontSize: ".8em" }}>This project is still a work in progress. Important features like a Login will follow!</span>
                        </div>}
                    <Switch>
                        {/* Shows all the Areas */}
                        <Route path="/">
                            <div className='moduleOverview'>
                                {this.state.newAreaActive ?
                                    <NewArea cancelClick={this.toggleActive} reloadAreas={this.state.reloadAreas} /> : null}
                                {this.state.isLoading ? "Loading Data" : displayareas}
                            </div>
                        </Route>
                    </Switch>
                </div>
            </Router>

        )
    }
}
