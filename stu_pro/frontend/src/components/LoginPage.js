import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage({ setIsAuthenticated, setUserRole }) {
  const [activeTab, setActiveTab] = useState("student"); // Default to student login
  const [username, setUsername] = useState("");  
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter both credentials.");
      return;
    }

    const endpoint = activeTab === "student" 
      ? "http://localhost:5001/login"  // Student login API
      : "http://localhost:5001/faculty-login"; // Faculty login API

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setUserRole(activeTab);
        localStorage.setItem("userRole", activeTab);
        localStorage.setItem("token", data.token);

        // ✅ Store student department and section for filtering messages
        if (activeTab === "student") {
          localStorage.setItem("studentDept", data.student.dept);
          localStorage.setItem("studentSec", data.student.sec);
        }

        navigate(activeTab === "student" ? "/student-dashboard" : "/faculty-dashboard");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="login-container">
      {/* Left Side - Image Section */}
      <div className="login-image">
        <img src="image.png" alt="Illustration" />
      </div>

      {/* Right Side - Login Form */}
      <div className="login-form">
        <h2>{activeTab === "student" ? "Student Log In" : "Faculty Log In"}</h2>

        {/* Tabs for Student and Faculty */}
        <div className="tabs">
          <button 
            className={activeTab === "student" ? "active" : ""} 
            onClick={() => setActiveTab("student")}
          >
            Student Login
          </button>
          <button 
            className={activeTab === "faculty" ? "active" : ""} 
            onClick={() => setActiveTab("faculty")}
          >
            Faculty Login
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}

        {/* Login Form */}
        <div className="input-group">
          <i className="fas fa-user"></i>
          <input
            type="text"
            placeholder={activeTab === "student" ? "Roll Number" : "Faculty ID"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn-login" onClick={handleLogin}>
          Log In
        </button>
      </div>
    </div>
  );
}
