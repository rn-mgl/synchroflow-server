import { Router } from "express";
import {
  createAssociateInvite,
  deleteAssociateInvite,
  getAllAssociateInvites,
  getAssociateInvite,
  updateAssociateInviteStatus,
} from "../controllers/associateInvitesController.js";

const router = Router();

router.route("/").post(createAssociateInvite).get(getAllAssociateInvites);
router
  .route("/:associate_invite_uuid")
  .delete(deleteAssociateInvite)
  .get(getAssociateInvite)
  .patch(updateAssociateInviteStatus);

export default router;
