import { Router } from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  updateTask,
} from "../controllers/tasksController.js";

const router = Router();

router.route("/").get(getAllTasks).post(createTask);
router.route("/:task_uuid").delete(deleteTask).get(getTask).patch(updateTask);

export default router;
