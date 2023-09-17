import { Router } from "express";
import {
  createSubTaskInvite,
  deleteSubTaskInvite,
  getAllSubTaskInvites,
  getSubTaskInvite,
  updateSubTaskInviteStatus,
} from "../controllers/subTaskInvitesController.js";

const router = Router();

router.route("/").post(createSubTaskInvite).get(getAllSubTaskInvites);
router
  .route("/:sub_task_invite_uuid")
  .get(getSubTaskInvite)
  .delete(deleteSubTaskInvite)
  .patch(updateSubTaskInviteStatus);

export default router;
