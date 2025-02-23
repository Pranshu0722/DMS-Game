// Navbar.js
import React from "react";
import { useNavigate } from "react-router-dom";


function Navbar({ title, showBackButton, buttons = [], isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <h2 className="navbar-title">{title}</h2>
      <div className="nav-buttons">
        {/* Back button if showBackButton is true */}
        {showBackButton && (
          <button onClick={() => navigate(-1)} className="nav-button">
            Back
          </button>
        )}

        {/* Render buttons passed through the 'buttons' prop */}
        {buttons.map((btn, index) => (
          <button key={index} onClick={btn.onClick} className="nav-button">
            {btn.label}
          </button>
        ))}

        {/* Optionally, you could handle login/logout separately elsewhere */}
      </div>
    </nav>
  );
}

export default Navbar;
