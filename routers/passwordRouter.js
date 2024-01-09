import { Router } from "express";
import { forgotPassword, newPassword } from "../controllers/authController.js";

const router = Router();

router.route("/forgot").post(forgotPassword);
router.route("/new/:token").patch(newPassword);

export default router;
