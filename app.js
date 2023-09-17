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

import { authMiddleware } from "./middlewares/authMiddleware.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware.js";

// api routes
import authRouter from "./routers/authRouter.js";

import associateInvitesRouter from "./routers/associateInvitesRouter.js";
import associatesRouter from "./routers/associatesRouter.js";

import groupMessageMembersRouter from "./routers/groupMessageMembersRouter.js";

dotenv.config();

//drivers

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

// api routes
app.use("/auth", authRouter);

app.use("/associates", authMiddleware, associatesRouter);
app.use("/associate_invites", authMiddleware, associateInvitesRouter);

app.use("/group_message_members", authMiddleware, groupMessageMembersRouter);

// web sockets

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
