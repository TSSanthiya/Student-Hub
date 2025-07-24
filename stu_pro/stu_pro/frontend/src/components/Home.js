import React, { useState } from "react";
import "./Home.css";

const departments = [
  { name: "Civil Engineering", image: "civil.png" },
  { name: "Computer Science and Engineering", image: "cse.png" },
  { name: "Cyber Security", image: "cybr.png" },
  { name: "Electronics and Communication Engineering", image: "ece.png" },
  { name: "Electrical and Electronics Engineering", image: "eee.png" },
  { name: "Mechanical Engineering", image: "mech.png" },
  { name: "Information Technology", image: "it.png" },
  { name: "Artificial Intelligence and Data Science", image: "aids.png" },
  { name: "Science and Humanities", image: "sci.png" },
  { name: "Master of business administration", image: "mba.png" },
  { name: "VLSI Design and technology", image: "vlsi.png" },
];

const Home = () => {
  const [showDepartments, setShowDepartments] = useState(false);

  return (
    <div className="home">
      {/* College Banner */}
      <img src="/college-banner.png" alt="College Banner" className="banner" />
      <img src="/College-banners.png" alt="College Banner" className="banner" />

      {/* View Departments Button */}
      <div className="department-button-container">
        <button className="view-departments-btn" onClick={() => setShowDepartments(!showDepartments)}>
          {showDepartments ? "Hide Departments" : "View Departments"}
        </button>
      </div>

      {/* Departments Section (Only shown when button is clicked) */}
      {showDepartments && (
        <div id="departments" className="departments">
          <h2>DEPARTMENTS</h2>
          <hr className="line" />
          <div className="department-grid">
            {departments.map((dept, index) => (
              <div key={index} className="department-card">
                <img src={dept.image} alt={dept.name} />
                <h3>{dept.name}</h3>
                <a href={`/departments/${dept.name.toLowerCase().replace(/\s+/g, "-")}`} className="view-more">
                  View More...
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
