import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function StudentProfile() {
  const [profileData, setProfileData] = useState([]);
  const [studentName, setStudentName] = useState("");
  const navigate = useNavigate();
  const SEmail = localStorage.getItem("studentEmail");

  useEffect(() => {
    if (!SEmail) {
      navigate("/"); // Redirect to login if not logged in
      return;
    }

    // Fetch student's profile data
    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/student-profile?SEmail=${SEmail}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    // Fetch student's name (Assuming name is stored in localStorage)
    const fetchStudentName = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/get-student-name?SEmail=${SEmail}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch student name");
        }
        const data = await response.json();
        setStudentName(data.name);
      } catch (error) {
        console.error("Error fetching student name:", error);
      }
    };

    fetchProfileData();
    fetchStudentName();
  }, [SEmail, navigate]);

  return (
    <div>
      <Navbar title="Student Profile" showBackButton={true} />
      <div className="profile-container">
        <h2>Welcome, {studentName}</h2>
        <h3>Your Highest Scores</h3>
        <div className="table-container">
          <table className="score-table">
            <thead>
              <tr>
                <th>Game Name</th>
                <th>Highest Score</th>
              </tr>
            </thead>
            <tbody>
              {profileData.length > 0 ? (
                profileData.map((game, index) => (
                  <tr key={index}>
                    <td>{game.GameName}</td>
                    <td>{game.HScore}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No scores available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
