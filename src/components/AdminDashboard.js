import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function AdminDashboard() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);

  useEffect(() => {
    // Fetch games from backend
    const fetchGames = async () => {
      try {
        const response = await fetch("http://localhost:5000/games");
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('studentEmail'); 
    localStorage.removeItem('GID');     
    localStorage.removeItem('authToken');
    alert("Logged out successfully"); 
    navigate("/"); // Redirect to the landing page after logout
  };

  return (
    <div className="admin-dashboard">
      <Navbar
        title="Welcome Admin"
        showBackButton={false}
        buttons={
         [
                { label: "Logout", onClick: handleLogout },
              ]
        }
      />

      {/* Game Selection */}
      <div className="game-container">
        <h3>Select Game to Add Question</h3>
        <div className="games-grid">
          {games.length > 0 ? (
            games.map((game) => (
              <div
                key={game._id}
                className="game-box"
                onClick={() => navigate(`/add-question/${game.GID}`)} // Use GID here
              >
                {game.GName} {/* Use GName here */}
              </div>
            ))
          ) : (
            <p>No games found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
