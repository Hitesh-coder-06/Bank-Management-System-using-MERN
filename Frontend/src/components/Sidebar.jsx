import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
    return (
        <div className="sidebar">

            <h2>Menu</h2>

            <NavLink to="/dashboard">🏠Dashboard</NavLink>

            <NavLink to="/create-account">🏦Create Account</NavLink>

            <NavLink to="/deposit">💵Deposit Money</NavLink>

            <NavLink to="/balance">💳Balance</NavLink>

            <NavLink to="/transfer">💸Transfer</NavLink>

            <NavLink to="/transactions">📁Transactions</NavLink>

            <NavLink to="/profile">👤Profile</NavLink>

        </div>
    );
}

export default Sidebar;