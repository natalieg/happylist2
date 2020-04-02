import React from 'react'

export default function Areabar(props) {
    return (
        <div className="navbar">
            <ul>
                <li>
                    {props.areaActive &&
                        <div>
                            <button className="navBtn" onClick={props.clickArea}><i className="fas fa-plus"/> {props.nameArea}</button>
                            <span>&bull;</span>
                            <button className="navBtn" onClick={props.archiveTodos}>{props.nameArchive}</button>
                        </div>
                    }
                </li>
            </ul>
        </div>
    )
}
