import { Router } from "express";
import { uploadFiles } from "../controllers/fileController.js";

const router = Router();

router.route("/").post(uploadFiles);

export default router;
