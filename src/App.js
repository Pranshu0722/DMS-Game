import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import TopicPage from "./components/TopicPage";
import GamePage from "./components/GamePage";
import HowToPlayPage from "./components/HowToPlayPage";
import AdminLogin from "./components/AdminLogin";
import StudentLogin from "./components/StudentLogin";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import AddQuestion from "./components/AddQuestion"; 
import Feedback from "./components/Feedback";
import HomePage from "./components/Homepage";
import StudentProfile from "./components/StudentProfile";
import "./App.css";

function App() {
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/student" element={<LandingPage />} />
          <Route path="/topic/:GName" element={<TopicPage />} />
          <Route path="/game/:GName" element={<GamePage />} />
          <Route path="/how-to-play/:GName" element={<HowToPlayPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route  path="/student-login" element={<StudentLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/add-question/:gid" element={<AddQuestion />} />
        <Route path="/add-question/:gid" element={<AddQuestion />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/profile" element={<StudentProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;