import React from 'react'

export default function OverviewAreas(props) {
    return (
        <div className="areaOverview">
            <h1>Area Overview</h1>
            <p>You have {props.areaCount} Areas and {props.allTodoCount} ToDos</p>
        </div>
    )
}
