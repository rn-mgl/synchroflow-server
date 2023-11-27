import { v4 as uuidv4 } from "uuid";
import { StatusCodes } from "http-status-codes";
import { SubTasks } from "../models/SubTasks.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { MainTasks } from "../models/MainTasks.js";

export const createSubTask = async (req, res) => {
  const { subTaskData, mainTaskUUID } = req.body;
  const { subTaskTitle, subTaskSubtitle, subTaskDescription, subTaskPriority, subTaskStartDate, subTaskEndDate } =
    subTaskData;
  const { id } = req.user;
  const subTaskUUID = uuidv4();

  const mainTask = await MainTasks.getMainTask("main_task_uuid", mainTaskUUID);

  const subTask = new SubTasks(
    subTaskUUID,
    id,
    mainTask.main_task_id,
    subTaskTitle,
    subTaskSubtitle,
    subTaskDescription,
    subTaskPriority,
    subTaskStartDate,
    subTaskEndDate
  );

  const newSubTask = await subTask.createSubTask();

  if (!newSubTask) {
    throw new BadRequestError("Error in creating sub task. Try again later.");
  }

  res.status(StatusCodes.OK).json(newSubTask);
};

export const updateSubTask = async (req, res) => {
  const {
    sub_task_title,
    sub_task_subtitle,
    sub_task_description,
    sub_task_priority,
    sub_task_status,
    sub_task_start_date,
    sub_task_end_date,
  } = req.body;
  const { sub_task_uuid } = req.params;

  const subTask = await SubTasks.getSubTask("sub_task_uuid", sub_task_uuid);

  if (!subTask) {
    throw new NotFoundError("This sub task does not exist.");
  }

  const updateSubTask = await SubTasks.updateSubTask(
    sub_task_title,
    sub_task_subtitle,
    sub_task_description,
    sub_task_priority,
    sub_task_status,
    sub_task_start_date,
    sub_task_end_date,
    "sub_task_id",
    subTask.sub_task_id
  );

  if (!updateSubTask) {
    throw new BadRequestError("Error in updating sub task. Try again later.");
  }

  res.status(StatusCodes.OK).json(updateSubTask);
};

export const getSubTask = async (req, res) => {
  const { sub_task_uuid } = req.params;

  const subTask = await SubTasks.getSubTask("sub_task_uuid", sub_task_uuid);

  if (!subTask) {
    throw new NotFoundError("This sub task does not exist.");
  }
  res.status(StatusCodes.OK).json(subTask);
};

const getAllMySubTasks = async (req, res) => {
  const { id } = req.user;

  const subTasks = await SubTasks.getAllSubTasks("sub_task_by", id);

  if (!subTasks) {
    throw new NotFoundError("This task does not exist.");
  }

  res.status(StatusCodes.OK).json(subTasks);
};

const getAllCollaboratedSubTasks = async (req, res) => {
  const { id } = req.user;

  const subTask = await SubTasks.getAllSubTasks("stc.collaborator_id", id);

  if (!subTask) {
    throw new NotFoundError("This task does not exist.");
  }

  res.status(StatusCodes.OK).json(subTask);
};

const getAllMainTaskSubTasks = async (req, res) => {
  const { id } = req.user;
  const { mainTaskUUID } = req.query;

  const mainTask = await MainTasks.getMainTask("main_task_uuid", mainTaskUUID);

  if (!mainTask) {
    throw new NotFoundError(`The main task you are trying to access does not exist.`);
  }

  const subTask = await SubTasks.getAllSubTasks("mt.main_task_id", mainTask.main_task_id);

  if (!subTask) {
    throw new NotFoundError("This task does not exist.");
  }

  res.status(StatusCodes.OK).json(subTask);
};

export const getAllSubTasks = async (req, res) => {
  const { type } = req.query;

  switch (type) {
    case "my":
      await getAllMySubTasks(req, res);
      return;

    case "collaborated":
      await getAllCollaboratedSubTasks(req, res);
      return;

    case "main task":
      await getAllMainTaskSubTasks(req, res);
      return;

    default:
      return;
  }
};

export const deleteSubTask = async (req, res) => {
  const { sub_task_uuid } = req.params;

  const subTask = await SubTasks.getSubTask("sub_task_uuid", sub_task_uuid);

  if (!subTask) {
    throw new NotFoundError("This task does not exist.");
  }

  const deleteTask = await SubTasks.deleteSubTask("sub_task_id", subTask.sub_task_id);

  if (!deleteTask) {
    throw new BadRequestError("Error in deleting task. Try again later.");
  }

  res.status(StatusCodes.OK).json(deleteTask);
};
