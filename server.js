import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import messageRouter from "./routers/messageRouter.js";
import chatsRouter from "./routers/chatRouter.js";
import connectDB from "./db/index.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket/socket.js";

dotenv.config();
connectDB();
const app = express();
// Create HTTP server and wrap the Express app
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// Initialize socket and store reference
initSocket(io);
app.use(cors());
app.use(express.json());

app.use("/api/messages", messageRouter);
app.use("/api/chats", chatsRouter);

httpServer.listen(5001, () => {
  console.log(`Server is running on port ${5001}`);
});
