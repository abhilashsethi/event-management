import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import profileRoutes from "./src/routes/profile.routes.js";
import eventRoutes from "./src/routes/event.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/profiles", profileRoutes);
app.use("/api/events", eventRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
