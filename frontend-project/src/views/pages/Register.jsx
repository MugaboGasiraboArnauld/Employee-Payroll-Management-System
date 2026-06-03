import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../controllers/authController";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (!username || !password) { console.error("Please fill up all fields!"); return; }
    registerUser(username, password)
      .then((res) => { console.log(res.message); navigate("/"); })
      .catch((err) => { console.error(err.response?.data?.message || "Registration failed!"); });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-page p-4">
      <div className="card w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-content mb-2">Create Account</h1>
          <p className="text-muted">Join the HRMS system</p>
        </div>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input type="text" value={username} placeholder="Username..." className="input-field" onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" value={password} placeholder="Password..." className="input-field" onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn">Register</button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-muted">Already have an account? <Link to="/" className="text-content font-medium">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
