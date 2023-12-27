import { Router } from "express";
import {
  createGroupMessage,
  deleteGroupMessage,
  getAllGroupMessages,
  getGroupMessage,
} from "../controllers/groupMessagesController.js";

const router = Router();

router.route("/").post(createGroupMessage).get(getAllGroupMessages);
router.route("/:message_uuid").get(getGroupMessage).delete(deleteGroupMessage);

export default router;
