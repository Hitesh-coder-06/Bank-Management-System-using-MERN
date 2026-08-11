import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import api from "../api/axios";

import "../styles/Balance.css";

function Balance() {

    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);

    async function getBalance() {

        try {

            setLoading(true);

            const response = await api.get("/accounts/balance");

            setBalance(response.data.balance);

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to fetch balance"
            );

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        getBalance();

    }, []);

    return (

        <>
            <Navbar />

            <div className="balance-layout">

                <Sidebar />

                <div className="balance-content">

                    <div className="balance-card">

                        <h2>Account Balance</h2>

                        <h1>₹ {balance}</h1>

                        <p>Current Available Balance</p>

                        <button onClick={getBalance}>

                            {loading ? "Loading..." : "Refresh"}

                        </button>

                    </div>

                </div>

            </div>

        </>

    );

}

export default Balance;