import { Router } from "express";
import {
  createPrivateMessageMember,
  deletePrivateMessageMember,
  getAllPrivateMessageMembers,
  getPrivateMessageMember,
} from "../controllers/privateMessageMembersController.js";

const router = Router();

router.route("/").post(createPrivateMessageMember).get(getAllPrivateMessageMembers);
router.route("/:private_message_member_uuid").get(getPrivateMessageMember).delete(deletePrivateMessageMember);

export default router;
