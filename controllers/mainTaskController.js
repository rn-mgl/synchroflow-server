import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../errors";
import { EXPECTATION_FAILED, StatusCodes } from "http-status-codes";
import { MainTasks } from "../models/MainTask";

export const createMainTask = async (req, res) => {
  const { taskName, taskDescription, taskPriority, taskStartDate, taskEndData } = req.body;
  const taskUUID = uuidv4();
  const { id } = req.user;

  const mainTask = new MainTasks(taskUUID, id, taskName, taskDescription, taskPriority, taskStartDate, taskEndData);

  const newMainTask = await mainTask.createMainTask();

  if (!newMainTask) {
    throw new BadRequestError("Error in creating main task. Try again later.");
  }

  res.status(StatusCodes.OK).json(newMainTask);
};

export const updateMainTask = async (req, res) => {
  const { main_task_uuid } = req.params;
  const {
    main_task_name,
    main_task_description,
    main_task_priority,
    main_task_status,
    main_task_start_date,
    main_task_end_date,
  } = req.body;

  const mainTask = await MainTasks.getMainTask("main_task_uuid", main_task_uuid);

  if (!mainTask) {
    throw new NotFoundError("This task does not exist.");
  }

  const updateTask = await MainTasks.updateMainTask(
    main_task_name,
    main_task_description,
    main_task_priority,
    main_task_status,
    main_task_start_date,
    main_task_end_date,
    "task_id",
    mainTask.task_id
  );

  if (!updateTask) {
    throw new BadRequestError("Error in updating task. Try again later.");
  }

  res.status(StatusCodes.OK).json(updateTask);
};

export const getMainTask = async (req, res) => {
  const { main_task_uuid } = req.params;

  const mainTask = await MainTasks.getMainTask("main_task_uuid", main_task_uuid);

  if (!mainTask) {
    throw new NotFoundError("This task does not exist.");
  }

  res.status(StatusCodes.OK).json(mainTask);
};

const getAllMyMainTasks = async (req, res) => {
  const { id } = req.params;

  const mainTask = await MainTasks.getMainTask("mt.main_task_by", id);

  if (!mainTask) {
    throw new NotFoundError("This task does not exist.");
  }

  res.status(StatusCodes.OK).json(mainTask);
};

const getAllCollaboratedMainTasks = async (req, res) => {
  const { id } = req.params;

  const mainTask = await MainTasks.getMainTask("mtc.collaborator_id", id);

  if (!mainTask) {
    throw new NotFoundError("This task does not exist.");
  }

  res.status(StatusCodes.OK).json(mainTask);
};

export const getAllMainTasks = async (req, res) => {
  const { type } = req.query;

  switch (type) {
    case "my":
      await getAllMyMainTasks(req, res);
      return;

    case "collaborated":
      await getAllCollaboratedMainTasks(req, res);
      return;

    default:
      return;
  }
};

export const deleteMainTask = async (req, res) => {
  const { main_task_uuid } = req.params;

  const mainTask = await MainTasks.getMainTask("main_task_uuid", main_task_uuid);

  if (!mainTask) {
    throw new NotFoundError("This task does not exist.");
  }

  const deleteTask = await MainTasks.deleteMainTask("task_id", mainTask.task_id);

  if (!deleteTask) {
    throw new BadRequestError("Error in deleting task. Try again later.");
  }

  res.status(StatusCodes.OK).json(deleteTask);
};
