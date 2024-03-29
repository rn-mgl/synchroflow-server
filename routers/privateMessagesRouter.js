import { Router } from "express";
import {
  createPrivateMessage,
  deletePrivateMessage,
  getAllPrivateMessages,
} from "../controllers/privateMessagesController.js";

const router = Router();

router.route("/").post(createPrivateMessage).get(getAllPrivateMessages);
router.route("/:message_uuid").delete(deletePrivateMessage);

export default router;
