import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import route from "./route.js";
import { addUser, findUser } from "./users.js";
import Message from "./db.js";

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
  //console.log("A new client connected");

  const room = "defaultRoom";

  socket.on("join", async ({ name, pass }) => {
    socket.join(room);

    const { user } = addUser({ name, pass });

    const messages = await Message.find();

    socket.emit("previousMessages", messages);

    socket.emit("message", {
      data: {
        user: { name: "Admin", pass: "111" },
        message: `Здравствуйте, ${user.name}`,
      },
    });

    socket.broadcast.to(room).emit("message", {
      data: {
        user: { name: "Admin", pass: "111" },
        message: `${user.name} присоединился(сь) к чату`,
      },
    });

    console.log(`${user.name} присоединился к чату`);
  });

  socket.on("sendMessage", async ({ message, params }) => {
    const user = findUser(params);

    if (user) {
      console.log(`Сообщение от ${user.name}:`, message);

      const newMessage = new Message({
        id_: message.id_,
        user: user.name,
        message,
        time: new Date(),
      });
      await newMessage.save();

      io.to(room).emit("message", { data: { user, message } });
    } else {
      console.error("Ошибка: пользователь не найден.");
    }
  });

  socket.on("delete", async ({ mesid }) => {
    console.log(mesid);
    const deleteMessage = await Message.findByIdAndDelete(mesid);
    console.log(deleteMessage);
    if (deleteMessage) {
      io.emit("messageDeleted", { messageId: mesid });
      console.log("отправил на клиент");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
