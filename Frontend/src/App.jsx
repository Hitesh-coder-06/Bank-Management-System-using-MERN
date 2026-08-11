import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateAccount from "./pages/CreateAccount";
import Deposit from "./pages/Deposit";
import Balance from "./pages/Balance";
import Transfer from "./pages/Transfer";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {

    return (

        <Routes>

            {/* Public Routes */}

            <Route path="/" element={<Login />} />

            <Route path="/register" element={<Register />} />


            {/* Protected Routes */}

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/create-account"
                element={
                    <ProtectedRoute>
                        <CreateAccount />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/deposit"
                element={
                    <ProtectedRoute>
                        <Deposit />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/balance"
                element={
                    <ProtectedRoute>
                        <Balance />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/transfer"
                element={
                    <ProtectedRoute>
                        <Transfer />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/transactions"
                element={
                    <ProtectedRoute>
                        <Transactions />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            {/* Invalid Route */}

            <Route path="*" element={<NotFound />} />

            
     
        </Routes>
        
        

    );

}

  


export default App;