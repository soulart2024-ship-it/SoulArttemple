// Main server entry point for SoulArt Temple
import express from "express";
import { registerRoutes } from "./routes";

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (for the existing frontend)
app.use(express.static("."));

async function startServer() {
  try {
    const server = await registerRoutes(app);
    
    server.listen(port, () => {
      console.log(`SoulArt Temple server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();