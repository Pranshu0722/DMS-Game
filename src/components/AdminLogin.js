import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function AdminLogin() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({ AEmail: "", APassword: "" });

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Admin Login Data:", admin);

    // Send to backend for authentication
    try {
      const response = await fetch("http://localhost:5000/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(admin),
      });

      if (response.ok) {
        alert("Login Successful");
        navigate("/admin-dashboard");
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="form-container">
      <Navbar title="Discrete Mathematics Game" showBackButton={true} />
      <form onSubmit={handleSubmit} class="common-form">
      <h2>Admin Login</h2>
        <input type="email" name="AEmail" placeholder="Email" value={admin.AEmail} onChange={handleChange} required />
        <input type="password" name="APassword" placeholder="Password" value={admin.APassword} onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
