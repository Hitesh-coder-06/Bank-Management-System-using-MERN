import { useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import api from "../api/axios";

import "../styles/Transfer.css";

function Transfer() {

    const [formData, setFormData] = useState({
        toAccount: "",
        amount: ""
    });

    const [loading, setLoading] = useState(false);

    function handleChange(e) {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    }

    async function handleSubmit(e) {

    e.preventDefault();

    try {

        setLoading(true);

        // Always fetch latest account from backend
        const accountResponse = await api.get("/accounts/my");

        const account = accountResponse.data;

        const response = await api.post("/transaction", {

            fromAccount: account._id,

            toAccount: formData.toAccount,

            amount: Number(formData.amount),

            idempotencyKey: crypto.randomUUID()

        });

        alert(response.data.message || "Transaction Successful");

        setFormData({
            toAccount: "",
            amount: ""
        });

    } catch (error) {

        alert(
            error.response?.data?.message ||
            "Transaction Failed"
        );

    } finally {

        setLoading(false);

    }

    }
    return (

        <>
            <Navbar />

            <div className="transfer-layout">

                <Sidebar />

                <div className="transfer-content">

                    <div className="transfer-card">

                        <h2>Transfer Money</h2>

                        <form onSubmit={handleSubmit}>

                            <label>Receiver Account ID</label>

                            <input
                                type="text"
                                name="toAccount"
                                placeholder="Enter Receiver Account ID"
                                value={formData.toAccount}
                                onChange={handleChange}
                                required
                            />

                            <label>Amount</label>

                            <input
                                type="number"
                                name="amount"
                                placeholder="Enter Amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                            />

                            <button type="submit">

                                {loading ? "Processing..." : "Transfer"}

                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </>

    );

}

export default Transfer;