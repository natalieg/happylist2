import React from 'react'
import {Link} from 'react-router-dom'

function Navbar() {
    return (
        <div className="navbar upperBar">
            <ul>
                <li>
                    <Link className="navBtn" to="/">
                        Areas
                    </Link>
                </li>
                <li>
                    <Link className="navBtn" to="/generateList">
                        List
                    </Link>
                </li>
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
