import { useContext } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { AuthContext } from "../context/AuthContext";

import "../styles/Profile.css";

function Profile(){

    const {user}=useContext(AuthContext);

    return(

        <>

            <Navbar/>

            <div className="profile-layout">

                <Sidebar/>

                <div className="profile-content">

                    <div className="profile-card">

                        <h2>User Profile</h2>

                        <div className="profile-row">

                            <strong>Name</strong>

                            <span>: {user?.name}</span>

                        </div>

                        <div className="profile-row">

                            <strong>Email</strong>

                            <span>: {user?.email}</span>

                        </div>

                    </div>

                </div>

            </div>

        </>

    )

}

export default Profile;