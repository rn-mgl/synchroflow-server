import { Router } from "express";
import {
  getUserSettings,
  updateUserSettings,
} from "../controllers/userSettingsController.js";

const router = Router();

router.route("/").get(getUserSettings).patch(updateUserSettings);

export default router;
