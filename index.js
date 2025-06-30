import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import os from "os";
import fs from "fs";
import { Server } from "socket.io";
import http from "http"; // ✅ Instead of https
//
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

//
import compression from "compression";
import { EventEmitter } from "events";

import userRouter from "./routes/user.js";
import creatorRouter from "./routes/creator.js";
import roleRouter from "./routes/role.js";
import employeeRouter from "./routes/employees.js";
import taskRouter from "./routes/task.js";
import contentRequestRouter from "./routes/contentRequest.js";
import folderRouter from "./routes/folder.js";
import contentRouter from "./routes/content.js";
import notificationsRouter from "./routes/notifications.js";
import timeTrackingRouter from "./routes/timeTracking.js";
import financeRouter from "./routes/finance.js";
import credentialsRouter from "./routes/credentials.js";
import paymentsRouter from "./routes/payments.js";
import bonusRouter from "./routes/bonus.js";
import receiptRouter from "./routes/receipts.js";
import invoiceRouter from "./routes/invoice.js";
import documentTabRouter from "./routes/documents/tabs.js";
import adminRouter from "./routes/admin.js";
import subscriptionsRouter from "./routes/subscriptions.js";
import adminDocumentRouter from "./routes/adminDocuments.js";
import emailTemplateRouter from "./routes/emailTemplate.js";

// Raise the max listeners limit
EventEmitter.defaultMaxListeners = 30;
process.setMaxListeners(30);

const sslOptions = {
  key: fs.readFileSync("/etc/letsencrypt/live/backend.ofmbase.com/privkey.pem"),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/backend.ofmbase.com/fullchain.pem"
  ),
};

// const sslOptions = {
//   key: fs.readFileSync(path.join(__dirname, "certs", "key.pem")),
//   cert: fs.readFileSync(path.join(__dirname, "certs", "cert.pem")),
// };

// App setup
const app = express();
const server = http.createServer(app); // ✅ Not https.createServer
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

//
// 🔧 Middleware to attach io to req
// 🔧 Middleware to attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});
//

io.on("connection", (socket) => {
  // You may still listen for identification, but don't join any rooms
  socket.on("join", (userId) => {});

  socket.on("disconnect", () => {});
});

const port = process.env.PORT || 4000;

// Middlewares
// Middlewares
app.use(compression());
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// DB connection
connectDB();

// Simple test route
app.get("/", (req, res) => {
  res.send("Server is running 🎉");
});

// API routes
// API routes
// API routes
app.use("/api/user", userRouter);
app.use("/api/creator", creatorRouter);
app.use("/api/role", roleRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/task", taskRouter);
//
app.use("/api/content-request", contentRequestRouter);
app.use("/api/folders", folderRouter);
app.use("/api/content", contentRouter);
app.use("/api/notifications", notificationsRouter);
//
// Date Entery modules
app.use("/api/time-tracking", timeTrackingRouter);
app.use("/api/finance", financeRouter);
app.use("/api/credentials", credentialsRouter);
app.use("/api/payment", paymentsRouter);
app.use("/api/bonus", bonusRouter);
app.use("/api/receipts", receiptRouter);
app.use("/api/invoices", invoiceRouter);
// Document Section Router
app.use("/api/document/tabs", documentTabRouter);
app.use("/api/subscriptions", subscriptionsRouter);
//Finally admin routes
app.use("/api/admin", adminRouter);
app.use("/api/admin/documents", adminDocumentRouter);
app.use("/api/admin/templates", emailTemplateRouter);

// Helper to get local IP
const getLocalIPAddress = () => {
  const interfaces = os.networkInterfaces();
  for (let name in interfaces) {
    for (let iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
};
const localIP = getLocalIPAddress();

// Start HTTP server
server.listen(5000, "0.0.0.0", () => {
  console.log("✅ HTTP server running on http://localhost:5000");
});
