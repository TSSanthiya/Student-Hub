import React, { createContext, useContext, useEffect, useState } from "react";
const MessageContext = createContext();
export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  // Function to fetch messages from the backend
  const fetchMessages = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/messages");
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      console.log("📩 Fetched messages from backend:", data); // ✅ Debugging
      setMessages(data);
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
    }
  };

  // Function to send a message
  const sendMessage = async (messageData) => {
    try {
      console.log("📤 Sending message:", messageData); // ✅ Debugging before sending

      const response = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error("❌ Failed to send message");
      }

      const newMessage = await response.json();
      console.log("✅ Message saved in backend:", newMessage); // ✅ Debugging response

      fetchMessages(); // ✅ Immediately refresh messages after sending
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MessageContext.Provider value={{ messages, sendMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
