import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";

import "../styles/CreateAccount.css";

function CreateAccount() {

    const [loading, setLoading] = useState(false);

    async function createAccount() {

        try {

            setLoading(true);

            const response = await api.post("/accounts");

            alert(response.data.message);

            localStorage.setItem(
                "account",
                JSON.stringify(response.data.account)
            );

        } catch (error) {

            alert(error.response?.data?.message || "Failed to create account");

        } finally {

            setLoading(false);

        }

    }

    return (
        <>
            <Navbar />

            <div className="create-layout">

                <Sidebar />

                <div className="create-content">

                    <div className="create-card">

                        <h2>Create Bank Account</h2>

                        <p>Click the button below to create your bank account.</p>

                        <button
                            onClick={createAccount}
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Account"}
                        </button>

                    </div>

                </div>

            </div>

        </>
    );
}

export default CreateAccount;