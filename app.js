import "express-async-errors";
import dotenv from "dotenv";

import express from "express";
import helmet from "helmet";
import cors from "cors";
import fileUpload from "express-fileupload";
import sendgrid from "@sendgrid/mail";

import { v2 as cloudinary } from "cloudinary";
import { Server } from "socket.io";
import { createServer } from "http";

import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware.js";

dotenv.config();

const app = express();
const httpsServer = createServer(app);
const io = new Server(httpsServer);

app.use(express.json({ limit: "100mb" }));
app.use(helmet());
app.use(cors());
app.use(fileUpload({ useTempFiles: true }));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

sendgrid.setApiKey(process.env.SENDGRID_SECRET);

io.on("connection", (socket) => {
  console.log(socket.id);
});

app.use(errorMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 9000;

const start = async () => {
  try {
    httpsServer.listen(port, () => {
      console.log(`Listening to port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
