import { Router } from "express";
import { loginUser, registerUser, verifyUser } from "../controllers/authController.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify").patch(verifyUser);

export default router;
