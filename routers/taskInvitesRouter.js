import { Router } from "express";
import {
  createTaskInvite,
  deleteTaskInvite,
  getAllTaskInvites,
  getTaskInvite,
  updateTaskInviteStatus,
} from "../controllers/taskInvitesController.js";

const router = Router();

router.route("/").post(createTaskInvite).get(getAllTaskInvites);
router
  .route("/:task_invite_uuid")
  .get(getTaskInvite)
  .delete(deleteTaskInvite)
  .patch(updateTaskInviteStatus);

export default router;
