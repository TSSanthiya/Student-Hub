const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.SECOND_SERVER_PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads")); // ✅ Serve uploaded files

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/studenthub", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ===== SCHEMAS =====

// Student Schema
const studentSchema = new mongoose.Schema({
  rollno: String,
  registerno: String,
  studentname: String,
  dept: String,
  sec: String,
});
const Student = mongoose.model("studentdata", studentSchema, "studentdata");

// Faculty Schema
const facultySchema = new mongoose.Schema({
  ID: { type: String, required: true },
});
const Faculty = mongoose.model("Faculty", facultySchema, "facultylogin");

// Message Schema
const messageSchema = new mongoose.Schema({
  text: String,
  department: String,
  year: String,
  section: String,
  tag: String,
  file: String,
  timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", messageSchema, "messages");

// ===== ROUTES =====

// Student Login
app.post("/login", async (req, res) => {
  try {
    const { username } = req.body;
    const student = await Student.findOne({ rollno: username });
    if (!student) {
      return res.status(400).json({ success: false, message: "Invalid Roll Number" });
    }

    res.json({
      success: true,
      role: "student",
      message: "Login successful",
      student: {
        rollno: student.rollno,
        registerno: student.registerno,
        name: student.studentname,
        dept: student.dept,
        sec: student.sec,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Faculty Login
app.post("/faculty-login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Enter ID and password" });
  }

  try {
    const faculty = await Faculty.findOne({ ID: username });
    if (!faculty || faculty.ID !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: faculty.ID }, JWT_SECRET, { expiresIn: "1h" });
    res.json({
      success: true,
      role: "faculty",
      message: "Login successful",
      token,
      faculty: { id: faculty.ID },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ===== FILE UPLOAD & MESSAGE APIs =====

// Multer config
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Send Message (POST)
app.post("/send-message", upload.single("file"), async (req, res) => {
  try {
    const { text, department, year, section, tag } = req.body;
    const file = req.file ? req.file.filename : null;

    const newMessage = new Message({
      text,
      department,
      year,
      section,
      tag,
      file,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Messages (GET)
app.get("/api/messages", async (req, res) => {
  const { department, section } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { department, section },
        { department: "All" },
        { section: "All" }
      ]
    }).sort({ timestamp: -1 });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
