import dotenv from "dotenv";

import app from "./app.js";
import { connectDatabase } from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
  } catch (error) {
    console.error("Database connection failed. Continuing server startup:", error.message);
  }

  app.listen(PORT, () => {
    console.log(`SmartStore AI API running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start SmartStore AI API:", error.message);
  process.exit(1);
});