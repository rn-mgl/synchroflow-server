import "dotenv/config";
import "express-async-errors";

import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import helmet from "helmet";

import { v2 as cloudinary } from "cloudinary";
import { createServer } from "http";
import { Server } from "socket.io";

import { authMiddleware } from "./middlewares/authMiddleware.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware.js";

// api routes //////////////////////////////////////////////////////////////////////////////
import authRouter from "./routers/authRouter.js";
import fileRouter from "./routers/fileRouter.js";

import associateInvitesRouter from "./routers/associateInvitesRouter.js";
import associatesRouter from "./routers/associatesRouter.js";

import dashboardRouter from "./routers/dashboardRouter.js";

import roomMembersRouter from "./routers/roomMembersRouter.js";
import messageRoomsRouter from "./routers/messageRoomsRouter.js";
import messagesRouter from "./routers/messagesRouter.js";

import mainTaskCollaboratorsRouter from "./routers/mainTaskCollaboratorsRouter.js";
import mainTaskInvitesRouter from "./routers/mainTaskInvitesRouter.js";
import mainTasksRouter from "./routers/mainTasksRouter.js";

import taskCollaboratorsRouter from "./routers/taskCollaboratorsRouter.js";
import taskInvitesRouter from "./routers/taskInvitesRouter.js";
import tasksRouter from "./routers/tasksRouter.js";

import notificationsRouter from "./routers/notificationsRouter.js";

import passwordRouter from "./routers/passwordRouter.js";

import subTaskCollaboratorsRouter from "./routers/subTaskCollaboratorsRouter.js";
import subTasksRouter from "./routers/subTasksRouter.js";

import userSettingsRouter from "./routers/userSettingsRouter.js";
import usersRouter from "./routers/usersRouter.js";
import { sockets } from "./socket.js";

//drivers //////////////////////////////////////////////////////////////////////////////
const app = express();
const httpsServer = createServer(app);
const io = new Server(httpsServer, {
  cors: { origin: process.env.CORS_ORIGIN },
  transports: ["polling", "websocket"],
});

app.use(express.json({ limit: "100mb" }));
app.use(helmet());
app.use(cors());
app.use(fileUpload({ useTempFiles: true }));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// api routes //////////////////////////////////////////////////////////////////////////////
app.use("/auth", authRouter);
app.use("/password", passwordRouter);
app.use("/files", authMiddleware, fileRouter);

app.use("/associates", authMiddleware, associatesRouter);
app.use("/associate_invites", authMiddleware, associateInvitesRouter);

app.use("/dashboard", authMiddleware, dashboardRouter);

app.use(
  "/main_task_collaborators",
  authMiddleware,
  mainTaskCollaboratorsRouter,
);
app.use("/main_task_invites", authMiddleware, mainTaskInvitesRouter);
app.use("/main_tasks", authMiddleware, mainTasksRouter);

app.use("/notifications", authMiddleware, notificationsRouter);

app.use("/sub_task_collaborators", authMiddleware, subTaskCollaboratorsRouter);
app.use("/sub_tasks", authMiddleware, subTasksRouter);

app.use("/room_members", authMiddleware, roomMembersRouter);
app.use("/message_rooms", authMiddleware, messageRoomsRouter);
app.use("/messages", authMiddleware, messagesRouter);

app.use("/tasks", authMiddleware, tasksRouter);
app.use("/task_invites", authMiddleware, taskInvitesRouter);
app.use("/task_collaborators", authMiddleware, taskCollaboratorsRouter);

app.use("/users", authMiddleware, usersRouter);
app.use("/user_settings", authMiddleware, userSettingsRouter);

// web sockets //////////////////////////////////////////////////////////////////////////////

io.on("connection", (socket) => {
  try {
    sockets(socket);
  } catch (error) {
    console.log(`Fatal socket error: ${socket.id}`, error);
    socket.disconnect();
  }
});

app.use(errorMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 9000;

const start = async () => {
  try {
    httpsServer.listen(port, "0.0.0.0", () => {
      console.log(`Listening to port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
