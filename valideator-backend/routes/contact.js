const express = require("express");
const nodemailer = require("nodemailer");
const db = require("../firebase");

const router = express.Router();

// Configure Nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,       // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD // Gmail App Password (NOT your regular password)
  }
});

/**
 * POST /contact
 * Body: { name, email, message }
 * Saves contact form submissions to Firestore and sends email notification
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

    // Send email notification to syug200606@gmail.com
    const mailOptions = {
      from: `"Valideator Contact" <${process.env.GMAIL_USER}>`,
      to: "syug200606@gmail.com",
      replyTo: email.trim(),
      subject: `📩 New Contact Message from ${name.trim()} — Valideator`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f23; color: #e0e0e0; border-radius: 12px; overflow: hidden; border: 1px solid #2a2a4a;">
          <div style="background: linear-gradient(135deg, #7c3aed, #a855f7); padding: 24px 32px;">
            <h1 style="margin: 0; font-size: 22px; color: #fff;">🚀 New Contact Message</h1>
            <p style="margin: 4px 0 0; font-size: 14px; color: rgba(255,255,255,0.8);">from Valideator Contact Form</p>
          </div>
          <div style="padding: 28px 32px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #a78bfa; font-weight: 600; width: 90px;">Name:</td>
                <td style="padding: 8px 0;">${name.trim()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #a78bfa; font-weight: 600;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${email.trim()}" style="color: #818cf8;">${email.trim()}</a></td>
              </tr>
            </table>
            <div style="background: #1a1a2e; border-radius: 8px; padding: 16px 20px; border-left: 3px solid #7c3aed;">
              <p style="margin: 0 0 6px; color: #a78bfa; font-weight: 600; font-size: 13px;">Message:</p>
              <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message.trim()}</p>
            </div>
            <p style="margin-top: 24px; font-size: 12px; color: #666;">You can reply directly to this email to respond to ${name.trim()}.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

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
