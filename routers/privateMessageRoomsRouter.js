import { Router } from "express";
import {
  createPrivateMessageRoom,
  deletePrivateMessageRoom,
  getAllPrivateMessageRooms,
  getPrivateMessageRoom,
} from "../controllers/privateMessageRoomsController.js";

const router = Router();

router.route("/").post(createPrivateMessageRoom).get(getAllPrivateMessageRooms);
router.route("/:private_message_room").get(getPrivateMessageRoom).delete(deletePrivateMessageRoom);

export default router;
