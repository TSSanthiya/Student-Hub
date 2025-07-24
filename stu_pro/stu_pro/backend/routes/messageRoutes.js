const express = require("express");
const Message = require("../models/Message");
const router = express.Router();
// ✅ Send Message API
router.post("/", async (req, res) => {
  try {
    const { text, department, year, section, file } = req.body;

    if (!text || !department || !year || !section) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const newMessage = new Message({
      text,
      department,
      year,
      section,
      file: file || null, // ✅ Handle file attachment
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ Get Messages API
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 }); // ✅ Fetch latest messages first
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
