import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";

function HowToPlayPage() {
  const { GName } = useParams();

  // Topic-specific instructions
  const instructions = {
    Groups: [
      "Understand the concept of Groups.",
      "Learn the group operation.",
      "Explore examples of group elements.",
      "Test your knowledge by solving group-related problems.",
      "Each correct answer gives you Easy: +1, Medium: +2, Hard: +3 point.",
      "There is no negative marking."
    ],
    Semigroups: [
      "Understand the concept of Semigroups.",
      "Learn about the binary operation.",
      "Study the closure property.",
      "Work on problems related to semigroups.",
      "Each correct answer gives you Easy: +1, Medium: +2, Hard: +3 point.",
      "There is no negative marking."
    ],
    Isomorphism: [
      "Learn what isomorphism means in the context of groups and semigroups.",
      "Explore examples of isomorphic structures.",
      "Understand the criteria for two structures to be isomorphic.",
      "Practice by solving problems to check isomorphism between structures.",
      "Each correct answer gives you Easy: +1, Medium: +2, Hard: +3 point.",
      "There is no negative marking."
    ],
  };

  // Default instructions in case the GName doesn't match any of the above
  const defaultInstructions = [
    "Choose a topic to learn specific instructions.",
    "This section provides learning guides for the Discrete Mathematics game.",
    "Each correct answer gives you Easy: +1, Medium: +2, Hard: +3 point.",
    "There is no negative marking."
  ];

  // Fetch the instructions based on GName
  const topicInstructions = instructions[GName] || defaultInstructions;

  return (
    <div>
      <Navbar title="Discrete Mathematics Game" showBackButton={true} />
      <div className="container">
        <h2>How to Play {GName}</h2>
        <p>Here are the instructions for playing the {GName} game:</p>
        <ul className="instructions-list">
          {topicInstructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HowToPlayPage;
