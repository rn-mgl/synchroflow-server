import { Router } from "express";
import {
  createPrivateMessageRoom,
  deletePrivateMessageRoom,
  getAllPrivateMessageRooms,
  getPrivateMessageRoomMessages,
} from "../controllers/privateMessageRoomsController.js";

const router = Router();

router.route("/").post(createPrivateMessageRoom).get(getAllPrivateMessageRooms);
router.route("/:message_room").get(getPrivateMessageRoomMessages).delete(deletePrivateMessageRoom);

export default router;
