import { Router } from "express";
import { getUser, getUsers, updateUser } from "../controllers/usersController.js";

const router = Router();

router.route("/").get(getUsers);
router.route("/:user_uuid").get(getUser).patch(updateUser);

export default router;
