import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";
import "../styles/Transactions.css";

function Transactions() {

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchTransactions();
    }, []);

    async function fetchTransactions() {

        try {

            const response = await api.get("/transaction/my");

            setTransactions(response.data);

        } catch (error) {

            alert("Unable to fetch transactions");

        }

    }

    return (

        <>
            <Navbar />

            <div className="balance-layout">

                <Sidebar />

                <div className="balance-content">

                    <div className="balance-card">

                        <h2>Transaction History</h2>

                        {
                            transactions.length === 0 ?

                                <p>No Transactions Found</p>

                                :

                                <table className="transaction-table">

                                    <thead>

                                        <tr>

                                            <th>Amount</th>

                                            <th>Type</th>

                                            <th>Status</th>

                                            <th>From</th>

                                            <th>To</th>

                                            <th>Date</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {
                                            transactions.map((transaction) => (

                                                <tr key={transaction._id}>

                                                    <td>₹ {transaction.amount}</td>

                                                    <td
                                                        style={{
                                                            color: transaction.type === "Credit" ? "green" : "red",
                                                            fontWeight: "bold"
                                                        }}
                                                    >
                                                        {transaction.type}
                                                    </td>

                                                    <td>{transaction.status}</td>

                                                    <td>{transaction.fromAccount}</td>

                                                    <td>{transaction.toAccount}</td>

                                                    <td>
                                                        {new Date(transaction.createdAt).toLocaleString()}
                                                    </td>

                                                </tr>

                                            ))
                                        }

                                    </tbody>

                                </table>

                        }

                    </div>

                </div>

            </div>

        </>

    );

}

export default Transactions;