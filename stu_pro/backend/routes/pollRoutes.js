const express = require("express");
const Poll = require("../models/Poll");

const router = express.Router();

// Create a poll
router.post("/create", async (req, res) => {
  try {
    const { question, options, createdBy } = req.body;
    const poll = new Poll({ question, options, createdBy });
    await poll.save();
    res.status(201).json({ message: "Poll created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all polls
router.get("/all", async (req, res) => {
  try {
    const polls = await Poll.find().populate("createdBy");
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
