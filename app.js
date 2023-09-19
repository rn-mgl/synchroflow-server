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

// api routes //////////////////////////////////////////////////////////////////////////////
import authRouter from "./routers/authRouter.js";

import associateInvitesRouter from "./routers/associateInvitesRouter.js";
import associatesRouter from "./routers/associatesRouter.js";

import groupMessageMembersRouter from "./routers/groupMessageMembersRouter.js";
import groupMessageRoomsRouter from "./routers/groupMessageRoomsRouter.js";
import groupMessagesRouter from "./routers/groupMessagesRouter.js";

import mainTaskCollaboratorsRouter from "./routers/mainTaskCollaboratorsRouter.js";
import mainTaskInvitesRouter from "./routers/mainTaskInvitesRouter.js";
import mainTasksRouter from "./routers/mainTasksRouter.js";

import privateMessageMembersRouter from "./routers/privateMessageMembersRouter.js";
import privateMessageRoomsRouter from "./routers/privateMessageRoomsRouter.js";
import privateMessagesRouter from "./routers/privateMessagesRouter.js";

import subTaskCollaboratorsRouter from "./routers/subTaskCollaboratorsRouter.js";
import subTaskInvitesRouter from "./routers/subTaskInvitesRouter.js";
import subTasksRouter from "./routers/subTasksRouter.js";

import usersRouter from "./routers/usersRouter.js";

dotenv.config();

//drivers //////////////////////////////////////////////////////////////////////////////
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

// api routes //////////////////////////////////////////////////////////////////////////////
app.use("/auth", authRouter);

app.use("/associates", authMiddleware, associatesRouter);
app.use("/associate_invites", authMiddleware, associateInvitesRouter);

app.use("/main_task_collaborators", authMiddleware, mainTaskCollaboratorsRouter);
app.use("/main_task_invites", authMiddleware, mainTaskInvitesRouter);
app.use("/main_tasks", authMiddleware, mainTasksRouter);

app.use("/sub_task_collaborators", authMiddleware, subTaskCollaboratorsRouter);
app.use("/sub_task_invites", authMiddleware, subTaskInvitesRouter);
app.use("/sub_tasks", authMiddleware, subTasksRouter);

app.use("/private_message_members", authMiddleware, privateMessageMembersRouter);
app.use("/private_message_rooms", authMiddleware, privateMessageRoomsRouter);
app.use("/private_messages", authMiddleware, privateMessagesRouter);

app.use("/group_message_members", authMiddleware, groupMessageMembersRouter);
app.use("/group_message_rooms", authMiddleware, groupMessageRoomsRouter);
app.use("/group_messages", authMiddleware, groupMessagesRouter);

app.use("/users", authMiddleware, usersRouter);

// web sockets //////////////////////////////////////////////////////////////////////////////
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
