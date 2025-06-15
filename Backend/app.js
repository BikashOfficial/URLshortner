import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import connectDB from "./src/config/mongo.config.js";
// import { corsOptions } from "./src/config/cors.config.js";
import { errorHandler } from "./src/middleware/error.js";
import urlRoutes from "./src/routes/url.routes.js";
import authRoutes from "./src/routes/auth.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/', urlRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
