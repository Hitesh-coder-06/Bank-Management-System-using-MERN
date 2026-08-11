import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

import "../styles/Login.css";

function Login() {

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    function handleChange(e) {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    }

   async function handleSubmit(e) {

    e.preventDefault();

    setLoading(true);

    try {

        // Login
        const response = await api.post("/auth/login", formData);

        // Save user and token
        login(response.data.user, response.data.token);

        // Fetch logged-in user's account
        try {

            const accountResponse = await api.get("/accounts/my");

            localStorage.setItem(
                "account",
                JSON.stringify(accountResponse.data.account)
            );

        } catch (error) {

            // User has not created an account yet
            localStorage.removeItem("account");

        }

        alert("Login Successful");

        navigate("/dashboard");

    } catch (error) {

        alert(error.response?.data?.message || "Login Failed");

    } finally {

        setLoading(false);

    }

} 

    return (

        <div className="login-container">

            <div className="login-card">

                <h1>Bank Management System</h1>

                <h2>Login</h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <button type="submit">

                        {loading ? "Logging..." : "Login"}

                    </button>

                </form>

                <p>

                    Don't have an account?

                    <Link to="/register"> Register</Link>

                </p>

            </div>

        </div>

    );
}

export default Login;