import { Router } from "express";
import {
  createGroupMessageRoom,
  deleteGroupMessageRoom,
  getAllGroupMessageRoom,
  getGroupMessageRoom,
  updateGroupMessage,
} from "../controllers/groupMessageRoomsController.js";

const router = Router();

router.route("/").post(createGroupMessageRoom).get(getAllGroupMessageRoom);
router.route("/:message_room").delete(deleteGroupMessageRoom).get(getGroupMessageRoom).patch(updateGroupMessage);

export default router;
