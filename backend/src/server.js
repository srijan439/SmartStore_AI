import "./config/env.js";

import dns from "node:dns";

import app from "./app.js";
import { connectDatabase } from "./config/database.js";

// Workaround for Node.js DNS resolution issues on Windows for MongoDB Atlas SRV records
try {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
} catch (dnsError) {
  console.warn("Could not set custom DNS servers for MongoDB connection:", dnsError.message);
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const server = app.listen(PORT, () => {
    console.log(`SmartStore AI API running on port ${PORT}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use. Stop the existing server or set a different PORT in backend/.env.`);
      process.exit(1);
    }

    throw error;
  });

  try {
    await connectDatabase();
  } catch (error) {
    console.error("Database connection failed. Continuing server startup:", error.message);
  }
};

startServer().catch((error) => {
  console.error("Failed to start SmartStore AI API:", error.message);
  process.exit(1);
});
