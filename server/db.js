import mongoose from "mongoose";

const mSchema = mongoose.Schema({
  user: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", mSchema);

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

export default mongoose.model("Message", mSchema);
