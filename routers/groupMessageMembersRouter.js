import { Router } from "express";
import {
  createGroupMessageMember,
  deleteGroupMessageMember,
  getAllGroupMessageMembers,
  getGroupMessageMember,
} from "../controllers/groupMessageMembersController.js";

const router = Router();

router.route("/").post(createGroupMessageMember).get(getAllGroupMessageMembers);
router.route("/:group_message_member_uuid").get(getGroupMessageMember).delete(deleteGroupMessageMember);

export default router;
