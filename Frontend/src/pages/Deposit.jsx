import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";

import "../styles/Deposit.css";

function Deposit() {

    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleDeposit(e) {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await api.post("/accounts/deposit", {
                amount: Number(amount)
            });

            alert(response.data.message);

            setAmount("");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Deposit Failed"
            );

        } finally {

            setLoading(false);

        }

    }

    return (

        <>
            <Navbar />

            <div className="deposit-layout">

                <Sidebar />

                <div className="deposit-content">

                    <div className="deposit-card">

                        <h2>Deposit Money</h2>

                        <form onSubmit={handleDeposit}>

                            <label>Amount</label>

                            <input
                                type="number"
                                placeholder="Enter Amount"
                                value={amount}
                                onChange={(e)=>setAmount(e.target.value)}
                                required
                            />

                            <button type="submit">

                                {loading ? "Depositing..." : "Deposit"}

                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </>

    );

}

export default Deposit;