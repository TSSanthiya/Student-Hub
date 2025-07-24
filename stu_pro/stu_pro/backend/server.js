const express = require("express");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");

const app = express();

// Middleware
app.use(express.json()); // Parse JSON body
app.use(cors()); // Allow frontend to connect

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve static files from 'uploads' directory
app.use("/uploads", express.static(uploadDir));

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/studenthub")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Fix: Added 'tag' field in schema
const MessageSchema = new mongoose.Schema({
  text: String,
  department: String,
  year: String,
  section: String,
  tag: String,  // ✅ Added missing tag field
  file: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("messages", MessageSchema);

// Multer Setup for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Save Message and File API
app.post("/send-message", upload.single("file"), async (req, res) => {
  try {
    const { department, year, section, text, tag } = req.body;
    const file = req.file ? req.file.filename : null;

    const message = new Message({ department, year, section, text, file, tag });
    await message.save();

    res.status(201).json({ success: true, message: "Message sent successfully!", data: message }); // ✅ Return saved message
  } catch (error) {
    console.error("❌ Error saving message:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Messages by Filters (For Student Dashboard)

app.get("/api/messages", async (req, res) => {
  try {
    const { department, section } = req.query;
    let filter = {};

    if (department) filter.department = department;
    if (section) filter.section = section;

    const messages = await Message.find(filter).sort({ timestamp: -1 });
    res.json(messages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)); 