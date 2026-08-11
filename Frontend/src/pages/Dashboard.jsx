import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import { Link } from "react-router-dom";

import "../styles/Dashboard.css";

function Dashboard() {

    const { user } = useContext(AuthContext);

    return (

        <>

            <Navbar />

            <div className="dashboard-container">

                <Sidebar />

                <div className="dashboard-content">

                    <h1>Dashboard</h1>

                    <p>Welcome, <strong>{user?.name}</strong></p>

                    <div className="card-container">

                        <div className="card">

                            <h3>Account</h3>

                            <p>Create and manage your bank account.</p>

                            <Link to="/create-account">
                                <button>Create Account</button>
                            </Link>

                        </div>

                        <div className="card">

                            <h3>Balance</h3>

                            <p>Check your account balance.</p>

                            <Link to="/balance">
                                <button>View Balance</button>
                            </Link>

                        </div>

                        <div className="card">

                            <h3>Transfer</h3>

                            <p>Transfer money securely.</p>

                            <Link to="/transfer">
                                <button>Transfer Money</button>
                            </Link>

                        </div>

                    </div>

                </div>

            </div>
            

        </>
        

    );

}

export default Dashboard;

