import { Router } from "express";
import {
  createMessageRoom,
  deleteMessageRoom,
  getAllMessageRoom,
  getMessageRoom,
  updateMessage,
} from "../controllers/messageRoomsController.js";

const router = Router();

router.route("/").post(createMessageRoom).get(getAllMessageRoom);
router
  .route("/:message_room")
  .delete(deleteMessageRoom)
  .get(getMessageRoom)
  .patch(updateMessage);

export default router;
