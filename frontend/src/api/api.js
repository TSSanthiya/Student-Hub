import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

// ✅ Fetch messages
export const fetchMessages = async () => {
  try {
    const response = await API.get("/api/messages"); // Adjust endpoint as needed
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

// ✅ Send message
export const sendMessage = async (messageData) => {
  try {
    const response = await API.post("/api/messages", messageData); // Adjust endpoint as needed
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
