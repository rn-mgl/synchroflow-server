import { Router } from "express";
import {
  createSubTaskCollaborator,
  deleteSubTaskCollaborator,
  getAllSubTaskCollaborators,
  getSubTaskCollaborator,
} from "../controllers/subTaskCollaboratorsController.js";

const router = Router();

router.route("/").post(createSubTaskCollaborator).get(getAllSubTaskCollaborators);
router.route("/:sub_task_collaborator_uuid").get(getSubTaskCollaborator).delete(deleteSubTaskCollaborator);

export default router;
