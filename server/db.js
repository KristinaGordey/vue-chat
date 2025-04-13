import mongoose from "mongoose";
const uSchema = mongoose.Schema({
  name: { type: String, required: true },
  pass: { type: String, required: true },
});

const mDialog = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

const mSchema = mongoose.Schema({
  user: { type: String, required: true },
  message: { type: String, required: true },
  dialogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dialog",
    required: true,
  },
  time: { type: Date, default: Date.now },
});

const User = mongoose.model("User", uSchema);
const Message = mongoose.model("Message", mSchema);
const Dialog = mongoose.model("Dialog", mDialog);

mongoose
  .connect("mongodb://127.0.0.1:27017/messagesDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Успешное подключение к MongoDB");
  })
  .catch((error) => {
    console.error("Ошибка подключения к MongoDB:", error);
  });

export { User, Dialog, Message };
