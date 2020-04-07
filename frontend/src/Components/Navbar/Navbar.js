import React from 'react'
import {Link} from 'react-router-dom'

function Navbar() {
    return (
        <div className="navbar upperBar">
            <ul>
                <li>
                    <Link className="navBtn" to="/areas">
                        Areas
                    </Link>
                </li>
                <span>&bull;</span>
                <li>
                    <Link className="navBtn" to="/generateList">
                        List
                    </Link>
                </li>
                <span>&bull;</span>
                <li>
                    <Link className="navBtn" to="/contact">
                        Contact
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default Navbar
