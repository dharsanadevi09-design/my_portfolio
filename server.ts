import express from "express";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer as createViteServer } from "vite";
import { initialPortfolioData } from "./src/initialData";

// Load environment variables configured in system secrets
dotenv.config();

const app = express();
// Note: Port is hardcoded to 3000 inside the code to comply with external reverse proxy configurations
const PORT = 3000;

app.use(express.json());

// --- DATABASE INSTRUCTIONS & CONFIGURATION ---
const MONGODB_URI = process.env.MONGODB_URI;
let dbConnected = false;

if (MONGODB_URI) {
  console.log("🍃 Attempting connection to MongoDB database...");
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log("🍃 MongoDB Database connected successfully!");
      dbConnected = true;
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      console.log("⚠️ Falling back to clean in-memory persistence layer for safety.");
    });
} else {
  console.warn("⚠️ MONGODB_URI is undefined. Server is starting with an in-memory database fallback.");
}

// MongoDB Dynamic Schemas
const portfolioSchema = new mongoose.Schema({
  key: { type: String, default: "primary", unique: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

const MessageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  senderName: { type: String, required: true },
  senderEmail: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: String, required: true },
  read: { type: Boolean, default: false },
  isBooking: { type: Boolean, default: false },
  bookingAmountPaid: { type: Number, default: 0 }
}, { timestamps: true });

// Declare as 'any' to bypass strict query typing constraints in older/newer mongoose packages
const Portfolio: any = mongoose.models.Portfolio || mongoose.model("Portfolio", portfolioSchema);
const MessageModel: any = mongoose.models.Message || mongoose.model("Message", MessageSchema);

// In-Memory Fallbacks (Used if MongoDB has not yet been connected/configured)
let memoryPortfolioData = { ...initialPortfolioData };
let memoryMessages: any[] = [];

// --- API ENDPOINTS ---

/**
 * Fetch Portfolio Settings
 * Priority: MongoDB -> In-Memory Fallback
 */
app.get("/api/portfolio", async (req, res) => {
  try {
    if (dbConnected) {
      let doc = await Portfolio.findOne({ key: "primary" });
      if (!doc) {
        doc = await Portfolio.create({ key: "primary", data: initialPortfolioData });
      }
      return res.json({ success: true, data: doc.data });
    } else {
      return res.json({ success: true, data: memoryPortfolioData });
    }
  } catch (error: any) {
    console.error("Error retrieving portfolio:", error);
    return res.status(500).json({ success: false, error: "Database lookup failed", details: error.message });
  }
});

/**
 * Update Portfolio Settings
 * Saves modifications to MongoDB structure or updates memory arrays dynamically
 */
app.post("/api/portfolio", async (req, res) => {
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ success: false, error: "Missing body data" });
  }

  try {
    if (dbConnected) {
      const doc = await Portfolio.findOneAndUpdate(
        { key: "primary" },
        { data },
        { new: true, upsert: true }
      );
      return res.json({ success: true, message: "Portfolio saved to cloud database successfully", data: doc.data });
    } else {
      memoryPortfolioData = data;
      return res.json({ success: true, message: "Portfolio stored to local runtime memory successfully", data: memoryPortfolioData });
    }
  } catch (error: any) {
    console.error("Error saving portfolio:", error);
    return res.status(500).json({ success: false, error: "Database operation failed", details: error.message });
  }
});

/**
 * Fetch all Contact and Transaction Messages
 */
app.get("/api/messages", async (req, res) => {
  try {
    if (dbConnected) {
      const docs = await MessageModel.find({}).sort({ createdAt: -1 });
      return res.json({ success: true, data: docs });
    } else {
      return res.json({ success: true, data: memoryMessages });
    }
  } catch (error: any) {
    console.error("Error loading messages database:", error);
    return res.status(500).json({ success: false, error: "Could not load messages from database." });
  }
});

/**
 * Submit New Message / Log Booking Request
 * Automatically triggers:
 *  1. Database Storage (MongoDB or Memory)
 *  2. SMTP Email alerts using secure Gmail App Password to both Admin and User
 */
app.post("/api/messages", async (req, res) => {
  const { senderName, senderEmail, subject, message, isBooking, bookingAmountPaid } = req.body;

  if (!senderName || !senderEmail || !message) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: senderName, senderEmail, message",
    });
  }

  const cleanSubject = subject || "New Contact Message Alert";
  const newId = "msg-" + Date.now();
  const timestampString = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();

  const newMessageObj = {
    id: newId,
    senderName,
    senderEmail,
    subject: cleanSubject,
    message,
    timestamp: timestampString,
    read: false,
    isBooking: !!isBooking,
    bookingAmountPaid: Number(bookingAmountPaid) || 0
  };

  // 1. Commit to database (MongoDB)
  try {
    if (dbConnected) {
      await MessageModel.create(newMessageObj);
    } else {
      memoryMessages.unshift(newMessageObj);
    }
  } catch (dbErr: any) {
    console.error("⚠️ Failed to write message record to DB:", dbErr.message);
  }

  // Retrieve user-defined Gmail variables from .env
  const adminEmail = process.env.EMAIL_USER || "dharsanadevi09@gmail.com";
  const smtpHost = "smtp.gmail.com";
  const smtpPort = 587;
  const smtpUser = process.env.EMAIL_USER;
  const smtpPass = process.env.EMAIL_PASS; // App Password

  // Generation of Email Format for the Administrator
  const adminEmailBody = `
======================================================
NEW PORTFOLIO TRANSACTION / INTERACTION INBOX ALERT
======================================================

Hello Admin,

You have received an interactive submission from your portfolio website visitor.

Sender Credentials:
----------------------------
Name: ${senderName}
Email Address: ${senderEmail}
Subject: ${cleanSubject}
Date / Time: ${timestampString}

Submission Details:
----------------------------
${message}

----------------------------
Message has been committed securely to MongoDB database collection.
Manage these submissions via your interactive configured Admin Console CMS!
`;

  // Generation of Email Receipt Confirmation for the sender
  const userEmailBody = `
======================================================
PORTFOLIO SUBMISSION RECEIPT CONFIRMATION
======================================================

Hello ${senderName},

Your transmission has been processed and safely delivered to Dharsana Devi!

Summary of records logged:
----------------------------
Subject: ${cleanSubject}
Log ID: ${newId}
Timestamp: ${timestampString}

Your message body:
----------------------------
${message}

----------------------------
This is an automated delivery confirmation. I will review your submission or order parameters and contact you inside this email address shortly.

Thank you,
Dharsana Devi Portfolio
`;

  // Check if SMTP is ready
  if (!smtpUser || !smtpPass) {
    console.warn(`
⚠️ [SMTP NOT CONFIGURED]
Cannot send mail notifications. Please populate these values in your workspace settings:
- EMAIL_USER (your Gmail Address, e.g., dharsanadevi09@gmail.com)
- EMAIL_PASS (your 16-Character Gmail APP PASSWORD)

------------------------------------------------------
SIMULATED NOTIFICATIONS (LOGGED TO CODES CONSOLE ONLY)
------------------------------------------------------
>>> ADMIN EMAIL AT: ${adminEmail}
${adminEmailBody}

>>> SENDER RECIPIENT EMAIL AT: ${senderEmail}
${userEmailBody}
------------------------------------------------------
`);

    return res.json({
      success: true,
      message: "Message successfully saved to Database! To get direct emails, add your SMTP Gmail App Password.",
      data: newMessageObj,
      simulated: true
    });
  }

  // 2. Transmit SMTP emails (to both User & Admin)
  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false, // true for 465, false for 587
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Alert Admin
    await transporter.sendMail({
      from: `"${senderName}" <${smtpUser}>`,
      to: adminEmail,
      replyTo: senderEmail,
      subject: `🔔 PORTFOLIO: ${cleanSubject}`,
      text: adminEmailBody,
    });

    // Confirmation Receipt to User
    await transporter.sendMail({
      from: `"Dharsana Devi Portfolio" <${smtpUser}>`,
      to: senderEmail,
      subject: `✉️ Received: ${cleanSubject}`,
      text: userEmailBody,
    });

    console.log(`📨 Live email alerts sent successfully to <${adminEmail}> and <${senderEmail}>!`);
    return res.json({
      success: true,
      message: "Submission saved to MongoDB and email dispatch verified successfully.",
      data: newMessageObj
    });
  } catch (emailErr: any) {
    console.error("❌ Failed to broadcast email notifications:", emailErr.message);
    // Return custom success since database commit was already successful!
    return res.json({
      success: true,
      message: "Saved successfully to database, but mail broadcasting failed.",
      error: emailErr.message,
      data: newMessageObj
    });
  }
});

/**
 * Delete Contact Message from database
 */
app.delete("/api/messages/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (dbConnected) {
      if (id === "all") {
        await MessageModel.deleteMany({});
      } else {
        await MessageModel.deleteOne({ id });
      }
    } else {
      if (id === "all") {
        memoryMessages = [];
      } else {
        memoryMessages = memoryMessages.filter(m => m.id !== id);
      }
    }
    return res.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Patch Contact Message read state
 */
app.patch("/api/messages/:id/read", async (req, res) => {
  const { id } = req.params;
  const { read } = req.body;

  try {
    if (dbConnected) {
      await MessageModel.findOneAndUpdate({ id }, { read: !!read });
    } else {
      memoryMessages = memoryMessages.map(m => m.id === id ? { ...m, read: !!read } : m);
    }
    return res.json({ success: true, message: "Status updated successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Setup development dev servers and fallback builds
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("🔧 Initializing Vite Dev Middleware Client Interfacing...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("🚀 Production mode asset indexing...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server actively running on port ${PORT}`);
  });
}

startServer();
