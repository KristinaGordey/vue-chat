import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import route from "./route.js";
import { addUser, findUser } from "./users.js";

const app = express();
app.use(cors({ origin: "*" }));
app.use(route);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("A new client connected");
  socket.on("join", ({ name, pass }) => {
    const { user, error } = addUser({ name, pass });
    const room = "defaultRoom";
    socket.join(room);

    socket.emit("message", {
      data: { user: { name: "Admin" }, message: `Hey ${user.name}` },
    });

    socket.broadcast.to(room).emit("message", {
      data: { user: { name: "Admin" }, message: `${user.name} has joined` },
    });

    socket.on("sendMessage", ({ message }) => {
      io.to(room).emit("message", { data: { user, message } });
      console.log("Отправка сообщения в комнату:", room);
    });
    // Обработка отключения пользователя
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
  // Обработка отключения пользователя
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
