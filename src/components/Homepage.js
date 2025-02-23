import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function HomePage() {
  const navigate = useNavigate();

  // Navigation handlers
  const handleAdminLogin = () => navigate("/admin-login");
  const handleStudentLogin = () => navigate("/student-login");
  const handleRegister = () => navigate("/register");

  return (
    <div>
      <Navbar
        title="Discrete Mathematics Game"
        showBackButton={false}
        buttons={[
          { label: "Admin Login", onClick: handleAdminLogin },
          { label: "Student Login", onClick: handleStudentLogin },
          { label: "Register", onClick: handleRegister },
        ]}
      />

      <div className="ppt-container">
        <iframe
          loading="lazy"
          className="ppt-iframe"
          src="https://www.canva.com/design/DAGbxEvgz5A/wqsaU9PUWUs6S4Ngcpq44Q/view?embed"
          allowFullScreen
          title="Presentation"
        ></iframe>
      </div>
    </div>
  );
}

export default HomePage;
