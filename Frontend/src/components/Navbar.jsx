import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import "../styles/Navbar.css";

function Navbar() {

    const { user, logout } = useContext(AuthContext);

    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <nav className="navbar">

            <div className="logo">
               🏦 Bank Management System
            </div>

            <div className="nav-right">

                <span>
                    Welcome, <strong>{user?.name}</strong>
                </span>

                <button onClick={handleLogout}>
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;