import "express-async-errors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import fileUpload from "express-fileupload";
import sendgrid from "@sendgrid/mail";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const app = express();

app.use(express.json({ limit: "100mb" }));
app.use(helmet());
app.use(cors());
app.use(fileUpload({ useTempFiles: true }));

cloudinary.config();
sendgrid.setApiKey();
