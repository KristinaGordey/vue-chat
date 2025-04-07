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

  const room = "defaultRoom";

  socket.on("join", ({ name, pass }) => {
    socket.join(room);

    const { user } = addUser({ name, pass });

    socket.emit("message", {
      data: {
        user: { name: "Admin", pass: "111" },
        message: `Hey ${user.name}`,
      },
    });

    socket.broadcast.to(room).emit("message", {
      data: {
        user: { name: "Admin", pass: "111" },
        message: `${user.name} has joined`,
      },
    });

    console.log(`${user.name} присоединился к комнате ${room}`);
  });

  socket.on("sendMessage", ({ message, params }) => {
    console.log(params);

    const user = findUser(params);

    if (user) {
      console.log(`Сообщение от ${user.name}:`, message);
      io.to("defaultRoom").emit("message", { data: { user, message } });
    } else {
      console.error("Ошибка: пользователь не найден.");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
