import { Router } from "express";
import {
  createMainTask,
  deleteMainTask,
  getAllMainTasks,
  getMainTask,
  updateMainTask,
} from "../controllers/mainTasksController.js";

const router = Router();

router.route("/").get(getAllMainTasks).post(createMainTask);
router.route("/:main_task_uuid").delete(deleteMainTask).get(getMainTask).patch(updateMainTask);

export default router;
