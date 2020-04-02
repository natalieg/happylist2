import React from 'react'
import OverviewAreas from './OverviewAreas';
import Welcome from './Welcome'

export default function UpperView(props) {
    let hasAreas = false;
    if (props.areaCount > 0) hasAreas = true;

    if (hasAreas) {
        return <OverviewAreas
            areaCount={props.areaCount}
            allTodoCount={props.allTodoCount} />
    } else {
        return <Welcome />
    }
}
