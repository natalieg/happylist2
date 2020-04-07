import React, { Component } from 'react';
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
        areaWidth: 320,
        listPositionLeft: 320
    }

    render() {
        return (
            <div className="mainView">
                <Rnd
                    style={style}
                    disableDragging={true}
                    default={{
                        x: 0,
                        y: 0,
                        width: this.state.areaWidth,
                    }}
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
                    <Areas />
                </Rnd>
                <div style={{left: this.state.listPositionLeft}} className='mainList'>
                    <GenerateList />
                </div>
            </div>
        )
    }
}
