import { Router } from "express";
import { getUserSettings, updateUserSettings } from "../controllers/userSettingsController.js";

const router = Router();

router.get("/:user_settings_uuid").get(getUserSettings).patch(updateUserSettings);

export default router;
