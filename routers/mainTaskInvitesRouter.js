import { Router } from "express";
import {
  createMainTaskInvite,
  deleteMainTaskInvite,
  getAllMainTaskInvites,
  getMainTaskInvite,
  updateMainTaskInviteStatus,
} from "../controllers/mainTaskInvitesController.js";

const router = Router();

router.route("/").post(createMainTaskInvite).get(getAllMainTaskInvites);
router
  .route("/:main_task_invite_uuid")
  .get(getMainTaskInvite)
  .delete(deleteMainTaskInvite)
  .patch(updateMainTaskInviteStatus);

export default router;
