import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000"); // Connect to the backend server

function Chat() {
  const [message, setMessage] = useState(""); // Store the message input
  const [messages, setMessages] = useState([]); // Store all received messages

  // Handle message input change
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  // Send message when button is clicked
  const sendMessage = () => {
    if (message.trim() !== "") {
      const newMessage = { sender: "Faculty", text: message };
      socket.emit("sendMessage", newMessage); // Emit message to backend
      setMessages([...messages, newMessage]); // Update local state
      setMessage(""); // Clear input field
    }
  };

  // Receive messages from the backend
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  return (
    <div className="chat-container">
      <h2>Faculty Chat</h2>

      {/* Chat Messages Display */}
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>

      {/* Message Input Box */}
      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
