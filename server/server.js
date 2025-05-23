import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { User, Dialog, Message } from "./db.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const JWT_SECRET = "9e8f2d4b-b3a1-4176-a8a9-7e0dcd4e9c7f";

io.on("connection", (socket) => {
  console.log(" Новое соединение");

  socket.on("join", async ({ name, pass, dialogId }) => {
    try {
      if (!name || !pass) {
        return socket.emit("error", { message: "Имя и пароль обязательны" });
      }

      let user = await User.findOne({ name });

      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass, salt);
        user = new User({ name, pass: hashedPassword });
        await user.save();

        const otherUsers = await User.find({ _id: { $ne: user._id } });

        for (const otherUser of otherUsers) {
          const existingDialog = await Dialog.findOne({
            participants: { $all: [user._id, otherUser._id], $size: 2 },
          });

          if (!existingDialog) {
            const newDialog = new Dialog({
              participants: [user._id, otherUser._id],
            });
            await newDialog.save();
          }
        }
      } else {
        const isPasswordValid = await bcrypt.compare(pass, user.pass);
        if (!isPasswordValid) {
          return socket.emit("error", { message: "Неверный пароль" });
        }
      }

      const token = jwt.sign({ userId: user._id, name }, JWT_SECRET, {
        expiresIn: "12h",
      });
      console.log("Созданный токен:", token);

      socket.emit("authorized", { token });
      socket.join(dialogId);

      if (!mongoose.Types.ObjectId.isValid(dialogId)) {
        return socket.emit("error", { message: "Некорректный ID диалога" });
      }

      const messages = await Message.find({
        dialogId: new mongoose.Types.ObjectId(dialogId),
      }).sort({ time: 1 });
      const dialog = await Dialog.findById(dialogId).populate(
        "participants",
        "name"
      );

      if (!dialog) {
        return socket.emit("error", { message: "Диалог не найден" });
      }

      const companion = dialog.participants.find((p) => p.name !== name);
      socket.emit("previousMessages", {
        messages,
        companionName: companion ? companion.name : "Собеседник",
      });

      socket.emit("message", {
        data: { user: { name: "Admin" }, message: ` ${name} в сети` },
      });
      socket.broadcast.to(dialogId).emit("message", {
        data: {
          user: { name: "Admin" },
          message: `${name} присоединился к чату`,
        },
      });
    } catch (err) {
      console.error("Ошибка при join:", err);
      socket.emit("error", { message: "Ошибка на сервере" });
    }
  });

  socket.on("getDialogs", async (userName) => {
    try {
      const user = await User.findOne({ name: userName });
      if (!user) {
        console.log("Пользователь не найден:", userName);
        return;
      }

      const dialogs = await Dialog.find({ participants: user._id })
        .populate("participants", "name")
        .exec();

      socket.emit("dialogList", {
        dialogs: dialogs.map((dialog) => ({
          id: dialog._id,
          participants: dialog.participants
            .filter((p) => p._id.toString() !== user._id.toString())
            .map((p) => p.name),
        })),
      });
    } catch (err) {
      console.error("Ошибка при getDialogs:", err);
      socket.emit("error", { message: "Ошибка при получении диалогов" });
    }
  });

  socket.on("sendMessage", async ({ message, params, dialogId }) => {
    const { name } = params;

    const newMessage = new Message({
      user: name,
      message,
      dialogId: new mongoose.Types.ObjectId(dialogId),
      time: new Date(),
    });

    await newMessage.save();

    io.to(dialogId).emit("message", {
      data: {
        user: { name },
        message,
        id: newMessage._id,
        time: newMessage.time,
      },
    });
  });

  socket.on("delete", async ({ mesid, dialogId }) => {
    const deleted = await Message.findByIdAndDelete(mesid);
    if (deleted) {
      io.to(dialogId).emit("messageDeleted", { messageId: mesid });
    }
  });

  socket.on("editMessage", async ({ mesid, newMessage, dialogId }) => {
    const updatedMessage = await Message.findByIdAndUpdate(
      mesid,
      { message: newMessage },
      { new: true }
    );
    if (updatedMessage) {
      io.to(dialogId).emit("messageUpdated", {
        messageId: mesid,
        newMessage,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(" Клиент отключён");
  });
});

server.listen(5000, () => {
  console.log("Сервер запущен на порту 5000");
});
