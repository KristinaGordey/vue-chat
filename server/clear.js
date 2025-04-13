import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/messagesDB";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("🧹 Подключено к MongoDB");

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    for (let coll of collections) {
      await mongoose.connection.db.dropCollection(coll.name);
      console.log(`✅ Коллекция удалена: ${coll.name}`);
    }

    console.log("🎉 Очистка завершена");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ Ошибка подключения или удаления:", err);
  });
