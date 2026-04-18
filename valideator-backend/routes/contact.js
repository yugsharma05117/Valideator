const express = require("express");
const db = require("../firebase");

const router = express.Router();

/**
 * POST /contact
 * Body: { name, email, message }
 * Saves contact form submissions to Firestore
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    // Save to Firestore
    await db.collection("contact_messages").add({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      createdAt: new Date(),
      read: false
    });

    res.json({ 
      success: true, 
      message: "Thank you! Your message has been sent successfully. We'll get back to you soon." 
    });

  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ error: "Failed to send message. Please try again." });
  }
});

/**
 * GET /contact
 * Fetches all contact messages (for admin use)
 */
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("contact_messages")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(messages);
  } catch (err) {
    console.error("Fetch contacts error:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
