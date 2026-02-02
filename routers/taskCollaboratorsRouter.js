import { Router } from "express";
import {
  createTaskCollaborator,
  deleteTaskCollaborator,
  getAllTaskCollaborator,
  getTaskCollaborator,
} from "../controllers/taskCollaboratorsController.js";

const router = Router();

router.route("/").post(createTaskCollaborator).get(getAllTaskCollaborator);
router
  .route("/:task_collaborator_uuid")
  .delete(deleteTaskCollaborator)
  .get(getTaskCollaborator);

export default router;
