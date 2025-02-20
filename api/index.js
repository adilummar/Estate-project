import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors'
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import imageupload from './routes/imageUpload.route.js'
import cookieParser from "cookie-parser";
import listingRouter from './routes/listing.route.js'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
path.resolve()

const app = express();
app.use(cors())
app.use(express.json());
app.use(cookieParser());
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to the DB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/upload", imageupload);
app.use("/api/listing", listingRouter)
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.listen(3000, () => {
  console.log("app is listening to post 3000");
});

// error middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
