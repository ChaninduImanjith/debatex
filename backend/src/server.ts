import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";

import { Server } from "socket.io";

import authRoutes from "./routes/auth.routes";
import { errorMiddleware } from "./middleware/error.middleware";

dotenv.config();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("DebateX API Running");
});

io.on("connection", (socket) => {
  console.log(
    "User connected:",
    socket.id
  );

  socket.on("join_room", (roomId) => {
    socket.join(roomId);

    console.log(
      `${socket.id} joined ${roomId}`
    );
  });

  socket.on(
    "send_message",
    ({ roomId, message }) => {
      io.to(roomId).emit(
        "receive_message",
        message
      );
    }
  );

  socket.on("disconnect", () => {
    console.log(
      "User disconnected:",
      socket.id
    );
  });
});

app.use(errorMiddleware);

server.listen(5000, () => {
  console.log(
    "Server running on port 5000"
  );
});