const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  department: String,
  year: String,
  section: String,
  text: String,
  file: String,
  timestamp: { type: Date, default: Date.now },
  tag: { type: String, enum: ["General", "Urgent", "Exam Notice"], default: "General" }
});

module.exports = mongoose.model("Message", messageSchema);