import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function LandingPage() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);

  // Fetch games (topics) from backend
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("http://localhost:5000/games"); // Assuming this returns games as topics
        const data = await response.json();
        setGames(data); // Assuming response has game data
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  const handleGameClick = (game) => {
      navigate(`/topic/${game.GName}`); // Navigate to TopicPage with GID
  };

  const handleLogout = () => {
    localStorage.removeItem('studentEmail');  // Remove SEmail from localStorage
    localStorage.removeItem('GID');     // Remove GID from localStorage
    localStorage.removeItem('authToken'); // If you have an auth token stored
    navigate("/"); // Redirect to the landing page after logout
  };

  return (
    <div>
      <Navbar
        title="Discrete Mathematics Game"
        showBackButton={false}
        buttons={ 
          [
            { label: "Profile", onClick: () => navigate("/profile") },
            { label: "Logout", onClick: handleLogout },
          ]
        }
      />
      <div className="container">
        <h1>Welcome!</h1>
        <p>Select a topic (game) to get started:</p>
        <div className="game-button">
          {games.length > 0 ? (
            games.map((game) => (
              <button
                key={game._id} // Assuming each game has an _id field
                onClick={() => handleGameClick(game)} // Navigate with game GID
                className="game-btn"
              >
                {game.GName} {/* Displaying the game name */}
              </button>
            ))
          ) : (
            <p>Loading games...</p>
          )}
        </div>
      </div>

      {/* ABOUT US Section */}
      <div className="about-us">
        <h2>ABOUT US</h2>
        <p>
          DISCRETA is an innovative project designed to make learning Discrete Mathematics fun and engaging by gamifying core concepts like group theory, isomorphism, and homomorphism. Our mission is to transform traditional learning methods by providing an interactive platform where students can explore, challenge, and apply theoretical concepts in a dynamic game environment. By combining the rigor of mathematical theory with the excitement of gaming, DISCRETA aims to enhance understanding, foster problem-solving skills, and create a more approachable learning experience for students of all levels. Whether you're a beginner or an advanced learner, DISCRETA offers a unique opportunity to master key topics in Discrete Mathematics while having fun.
        </p>
      </div>
    </div>
  );
}

export default LandingPage;
