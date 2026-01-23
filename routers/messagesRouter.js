import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  getAllMessages,
  getMessage,
} from "../controllers/messagesController.js";

const router = Router();

router.route("/").post(createMessage).get(getAllMessages);
router.route("/:message_uuid").get(getMessage).delete(deleteMessage);

export default router;
