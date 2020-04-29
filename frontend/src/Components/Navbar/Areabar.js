import React from 'react'

export default function Areabar(props) {
    return (
        <div className="navbar">
            <ul>
                <li>
                    {props.areaActive &&
                        <div>
                            <button className="navBtn" onClick={props.clickArea}><i className="fas fa-plus" />
                                <span className={props.areaWidth < 400 ? "hideSmall" : null}>
                                    {props.nameArea}
                                </span>
                            </button>
                            <button className="navBtn" onClick={props.archiveTodos}><i className="fas fa-archive"></i>
                                <span className={props.areaWidth < 400 ? "hideSmall" : null}>
                                    {props.nameArchive}
                                </span>
                            </button>
                            <button className="navBtn" onClick={props.changeInfoDisplay}><i className="fas fa-question-circle"></i>
                                <span className={props.areaWidth < 400 ? "hideSmall" : null}>
                                    Info
                             </span>
                            </button>
                        </div>
                    }
                </li>
            </ul>
        </div>
    )
}
