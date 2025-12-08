import express from "express";
// import userRoutes from "./routes/user.routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use("/api/users", userRoutes);

export default app;
