import React, { useState } from "react";
import axios from "axios";
import "./FacultyDashboard.css";

const FacultyDashboard = () => {
  const [message, setMessage] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [tag, setTag] = useState("");
  const [file, setFile] = useState(null);

  const handleSendMessage = async () => {
    if (!message.trim() && !file) {
      alert("❌ Please enter a message or upload a file.");
      return;
    }

    if (!department || !year || !section || !tag) {
      alert("❌ Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("text", message);
    formData.append("department", department);
    formData.append("year", year);
    formData.append("section", section);
    formData.append("tag", tag);
    if (file) formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5001/send-message", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        alert("✅ Message sent successfully!");
        setMessage("");
        setDepartment("");
        setYear("");
        setSection("");
        setTag("");
        setFile(null);
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
      alert("❌ Failed to send message.");
    }
  };

  return (
    <div className="faculty-dashboard">
      <h2>Faculty Dashboard</h2>

      <div className="filters">
        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="">Select Department</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="EEE">EEE</option>
          <option value="AIDS">AIDS</option>
          <option value="All">All</option>
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Select Year</option>
          <option value="1st">1st</option>
          <option value="2nd">2nd</option>
          <option value="3rd">3rd</option>
          <option value="4th">4th</option>
          <option value="All">All</option>
        </select>

        <select value={section} onChange={(e) => setSection(e.target.value)}>
          <option value="">Select Section</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="All">All</option>
        </select>

        <select value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="">Select Tag</option>
          <option value="urgent">Urgent</option>
          <option value="announcement">Announcement</option>
          <option value="exam">Exam</option>
          <option value="general">General</option>
        </select>
      </div>

      <textarea
        className="message-box"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button className="send-btn" onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default FacultyDashboard;
