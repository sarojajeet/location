import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB } from './db/db.config.js';
import sendEmail from './db/nodemailer.config.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cron from 'node-cron';
import multer from 'multer';

import Razorpay from 'razorpay';
dotenv.config({ path: './.env' });

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173/", "http://159.69.240.111:4000"], // Replace with your client URLs
    methods: ["GET", "POST"],
  },
});


app.use(express.json());


// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes

import testUser from "./routers/test.route.js"
import otp from "./routers/otp.routes.js"
import workerRoutes from "./routers/worker.routes.js"

app.use('/api/v1',testUser);
app.use('/api/v1',otp);
app.use('/api/v1',workerRoutes);

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}));


app.get("/api/getkey",(req,res)=>res.status(200).json({key:process.env.RAZORPAY_API_KEY}))

app.use('/exports', express.static(path.join(__dirname, 'controllers/public/exports')));
// Email Sending Endpoint
app.get("/send-email", async (req, res) => {
  try {
    await sendEmail(
      "recipient@example.com",
      "Test Subject",
      "Test email body",
      "<b>Test email body</b>"
    );
    res.send("Email sent!");
  } catch (error) {
    res.status(500).send("Failed to send email");
  }
});

// Socket.IO Connection
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});


// Start the Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, io};
