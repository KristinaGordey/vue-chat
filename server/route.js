import express from "express";

const router = express.Router();

// Пример маршрута
router.get("/", (req, res) => {
  res.send("Server is running");
});

export default router;
