import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bookRoutes from "./routes/bookRoutes";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bookRoutes);

const mongoURI = process.env.MONGO_URI as string;

mongoose.connect(mongoURI);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
