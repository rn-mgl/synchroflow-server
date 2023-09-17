import { Router } from "express";
import {
  createSubTask,
  deleteSubTask,
  getAllSubTasks,
  getSubTask,
  updateSubTask,
} from "../controllers/subTasksController.js";

const router = Router();

router.route("/").get(getAllSubTasks).post(createSubTask);
router.route("/:sub_task_uuid").get(getSubTask).delete(deleteSubTask).patch(updateSubTask);

export default router;
