import { Router } from "express";
import { getUser, updateUser } from "../controllers/usersController.js";

const router = Router();

router.route("/").get(getUser);
router.route("/:user_uuid").patch(updateUser);

export default router;
