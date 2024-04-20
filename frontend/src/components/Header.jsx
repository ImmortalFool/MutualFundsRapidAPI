import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Header = ({ title }) => {
    const [token, setToken] = useContext(UserContext)

    const handleLogout = () => {
        setToken(null)
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h1 className="title mt-5 ml-5">{title}</h1>
            </div>
            <div className="navbar-menu mt-5 mr-5">
                <div className="navbar-end">
                {token && (<button className="button is-primary" onClick={handleLogout}>Logout</button>)}
                </div>
            </div>
        </nav>
    )
}

export default Header
