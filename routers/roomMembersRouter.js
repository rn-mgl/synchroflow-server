import { Router } from "express";
import {
  createRoomMember,
  deleteRoomMember,
  getAllRoomMembers,
  getRoomMember,
} from "../controllers/roomMembersController.js";

const router = Router();

router.route("/").post(createRoomMember).get(getAllRoomMembers);
router.route("/:identifier").get(getRoomMember).delete(deleteRoomMember);

export default router;
