import { Router } from "express";
import {
  createGroupMessageMember,
  deleteGroupMessageMember,
  getAllGroupMessageMembers,
  getGroupMessageMember,
} from "../controllers/groupMessageMembersController.js";

const router = Router();

router.route("/").post(createGroupMessageMember).get(getAllGroupMessageMembers);
router
  .route("/:identifier")
  .get(getGroupMessageMember)
  .delete(deleteGroupMessageMember);

export default router;
