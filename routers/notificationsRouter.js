import { Router } from "express";
import { getNotifications } from "../controllers/notificationsController.js";

const router = Router();

router.route("/").get(getNotifications);

export default router;
