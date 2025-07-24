const express = require("express");
const router = express.Router();

// ✅ Test Route for GET
router.get("/test", (req, res) => {
  res.json({ message: "User API is working!" });
});

// ✅ Register User Route (Fix this if missing)
router.post("/register", (req, res) => {
  console.log("Received POST request:", req.body); // Debugging
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Request body is empty!" });
  }

  const { name, email, password, role, department } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing required fields!" });
  }

  res.json({ message: `User ${name} registered successfully!` });
});

module.exports = router;
