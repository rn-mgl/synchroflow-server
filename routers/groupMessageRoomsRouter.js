import { Router } from "express";
import {
  createGroupMessageRoom,
  deleteGroupMessageRoom,
  getAllGroupMessageRoom,
  getGroupMessageRoomMessages,
  updateGroupMessageRoomName,
} from "../controllers/groupMessageRoomsController.js";

const router = Router();

router.route("/").post(createGroupMessageRoom).get(getAllGroupMessageRoom);
router
  .route("/:message_room")
  .delete(deleteGroupMessageRoom)
  .get(getGroupMessageRoomMessages)
  .patch(updateGroupMessageRoomName);

export default router;
