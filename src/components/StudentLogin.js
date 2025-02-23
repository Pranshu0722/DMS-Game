import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function StudentLogin() {
  const [student, setStudent] = useState({
    SEmail: "",
    SPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Hook to navigate to another page

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent({
      ...student,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/student-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("studentEmail", student.SEmail);
        
        alert(data.message);

        // Navigate to the landing page (or wherever you want after login)
        navigate("/student"); // You can replace "/" with the desired path (e.g., "/profile" or "/dashboard")
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Navbar title="Discrete Mathematics Game" showBackButton={true} />
      <div className="form-container">
        <form onSubmit={handleSubmit} className="common-form">
          <h2>Student Login</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
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
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
}

export default StudentLogin;
