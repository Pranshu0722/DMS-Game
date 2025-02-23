import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Navbar from "./Navbar";


// Registering Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function Feedback() {
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { score, answeredQuestions, correctAnswers} = location.state || {};
  const totalQuestions = answeredQuestions || 0;
  const correct = correctAnswers || 0;

  // Retrieve GID and SEmail from localStorage or user context
  const SEmail = localStorage.getItem("studentEmail");
  const GID = localStorage.getItem("GID");
  
  const [hasSubmitted, setHasSubmitted] = useState(false); // State to track submission

  const submitScore = async () => {
    // Only submit the score if it hasn't been submitted yet
    if (hasSubmitted) return; // If already submitted, skip submission

    try {
      const response = await fetch("http://localhost:5000/submit-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          SEmail,
          GID,
          HScore: score, // Ensure score is passed here
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit score");
      }

      const result = await response.json();
      setMessage(result.message); // Display success message

      // Set flag to true after successful submission
      setHasSubmitted(true);
    } catch (err) {
      setMessage(err.message); // Display error message
    }
  };

  // Data for Pie Chart
  const pieData = {
    labels: ['Correct Answers', 'Incorrect Answers'],
    datasets: [
      {
        data: [correct, totalQuestions - correct],
        backgroundColor: ['#4caf50', '#f44336'],
        hoverBackgroundColor: ['#45a049', '#e53935'],
      },
    ],
  };

  // Options for Pie Chart
  const pieOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw} (${((tooltipItem.raw / totalQuestions) * 100).toFixed(2)}%)`;
          },
        },
      },
      legend: {
        position: 'top',
      },
    },
  };

  const handleLogout = () => {
    submitScore(); // Submit the score when logging out
    localStorage.removeItem('studentEmail');  // Remove SEmail from localStorage
    localStorage.removeItem('GID');     // Remove GID from localStorage
    localStorage.removeItem('authToken'); // If you have an auth token stored
    navigate("/"); // Redirect to the landing page after logout
  };

  const handleHome = () => {
    submitScore(); // Submit the score when going back to home
    navigate("/student"); // Redirect to home page
  };

  return (
    <div className="feedback-page">
      <Navbar
        title="Discrete Mathematics Game"
        showBackButton={false}
        buttons={ 
          [
            { label: "Logout", onClick: handleLogout },
          ]
        }
        />

      {/* Centered Score Display */}
      <div className="feedback-container">
        <h2>Your Score: {score}</h2>
        <p>Questions Answered: {totalQuestions}</p>
        <p>Correct Answers: {correct}</p>

        {/* Pie Chart */}
        {totalQuestions > 0 && (
          <div className="pie-chart-container">
            <h3>Performance Overview</h3>
            <Pie data={pieData} options={pieOptions} />
          </div>
        )}

        <button onClick={handleHome} className="home-button">
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default Feedback;
