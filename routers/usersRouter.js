import { Router } from "express";
import { getUser, updateUser } from "../controllers/usersController.js";

const router = Router();

router.route("/:user_uuid").get(getUser).patch(updateUser);

export default router;
