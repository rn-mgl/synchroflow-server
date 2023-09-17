import { Router } from "express";
import {
  createMainTaskCollaborator,
  deleteMainTaskCollaborator,
  getAllMainTaskCollaborator,
  getMainTaskCollaborator,
} from "../controllers/mainTaskCollaboratorsController.js";

const router = Router();

router.route("/").post(createMainTaskCollaborator).get(getAllMainTaskCollaborator);
router.route("/:main_task_collaborator_uuid").delete(deleteMainTaskCollaborator).get(getMainTaskCollaborator);

export default router;
