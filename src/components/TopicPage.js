import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";

function TopicPage() {
  const { GName } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <Navbar title="Discrete Mathematics Game" showBackButton={true} /> 
      <div className="container">
        <h2>{GName}</h2>
        <p>Choose an option below:</p>
        <div className="topic-button">
          <button onClick={() => navigate(`/game/${GName}`)}>Start Game</button>
          <button onClick={() => navigate(`/how-to-play/${GName}`)}>How to Play</button>
        </div>
      </div>
    </div>
  );
}

export default TopicPage;
