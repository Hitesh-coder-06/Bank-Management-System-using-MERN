import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";

import "../styles/Register.css";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
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

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setLoading(true);

        try {

            await api.post("/auth/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            alert("Registration Successful");

            navigate("/");

        } catch (error) {

            alert(error.response?.data?.message || "Registration Failed");

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="register-container">

            <div className="register-card">

                <h1>Bank Management System</h1>

                <h2>Register</h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Name</label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                    </div>

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

                    <div className="form-group">

                        <label>Confirm Password</label>

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <button type="submit">

                        {loading ? "Registering..." : "Register"}

                    </button>

                </form>

                <p>

                    Already have an account?

                    <Link to="/"> Login</Link>

                </p>

            </div>

        </div>

    );

}

export default Register;