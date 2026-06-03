import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../controllers/authController";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) return;
    loginUser(username, password)
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.user));
        navigate("/dashboard");
      })
      .catch((err) => { console.error(err); });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-page p-4">
      <div className="card w-full max-w-md mx-4 shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-content mb-1">HRMS</h1>
          <p className="text-muted text-sm">Human Resource Management System</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input type="text" value={username} placeholder="Enter your username" className="input-field" onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" value={password} placeholder="Enter your password" className="input-field" onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="text-center">
            <button type="submit" className="btn px-10">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
