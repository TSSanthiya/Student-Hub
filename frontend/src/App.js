import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Home from "./components/Home";
import About from "./pages/about";
import LoginPage from "./components/LoginPage";
import StudentDashboard from "./components/StudentDashboard";
import FacultyDashboard from "./components/FacultyDashboard";
import { MessageProvider } from "./context/MessageContext"; // ✅ Import MessageProvider

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'student' or 'faculty'

  return (
    <MessageProvider> {/* ✅ Wrap the entire app with MessageProvider */}
      <Router>
        {isAuthenticated && <Navbar userRole={userRole} />}
        <Routes>
          {/* Login Route */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <Navigate to={userRole === "faculty" ? "/faculty-dashboard" : "/student-dashboard"} />
              ) : (
                <LoginPage setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />
              )
            } 
          />

          {/* Authenticated Routes */}
          {isAuthenticated && (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route 
                path="/faculty-dashboard" 
                element={
                  <>
                    <Header />
                    <FacultyDashboard />
                  </>
                } 
              />
              <Route 
                path="/student-dashboard" 
                element={
                  <>
                    <Header />
                    <StudentDashboard />
                  </>
                } 
              />
            </>
          )}

          {/* Redirect if unauthorized */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </MessageProvider>
  );
}

export default App;
