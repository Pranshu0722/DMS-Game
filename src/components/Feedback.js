import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Feedback() {
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score || 0; // Default score is 0 if not provided

  return (
    <div className="feedback-page">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="navbar-heading">Feedback</h1>
      </nav>

      {/* Centered Score Display */}
      <div className="feedback-container">
        <h2>Your Score: {score}</h2>
        <button onClick={() => navigate("/student")} className="home-button">
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default Feedback;