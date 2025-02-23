import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
function Register() {
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    SName: "",
    SEmail: "",
    SPassword: "",
  });

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Registration Data:", student);

    // Send to backend for registration
    try {
      const response = await fetch("http://localhost:5000/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });

      if (response.ok) {
        alert("Registration Successful");
        navigate("/student-login");
      } else {
        const errorData = await response.json(); // Get error details
        alert(`Registration Failed: ${errorData.message}`); // Show error message from backend
      }
    } catch (error) {
      console.error("Registration Error:", error);
    }
  };

  return (
    <div className="form-container">
    <Navbar title="Discrete Mathematics Game" showBackButton={true} />
      <form onSubmit={handleSubmit} class="common-form">
        <h2>Register</h2>
        <input
          type="text"
          name="SName"
          placeholder="Full Name"
          value={student.SName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="SEmail"
          placeholder="Email"
          value={student.SEmail}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="SPassword"
          placeholder="Password"
          value={student.SPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
