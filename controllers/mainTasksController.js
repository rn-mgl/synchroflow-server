import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { MainTasks } from "../models/MainTasks.js";
import { MainTaskCollaborators } from "../models/MainTaskCollaborators.js";

export const createMainTask = async (req, res) => {
  const { mainTaskData } = req.body;
  const {
    mainTaskBanner,
    mainTaskTitle,
    mainTaskSubtitle,
    mainTaskDescription,
    maintTaskPriority,
    mainTaskStartDate,
    mainTaskEndDate,
  } = mainTaskData;
  const mainTaskUUID = uuidv4();
  const { id } = req.user;

  const mainTask = new MainTasks(
    mainTaskUUID,
    id,
    mainTaskBanner,
    mainTaskTitle,
    mainTaskSubtitle,
    mainTaskDescription,
    maintTaskPriority,
    mainTaskStartDate,
    mainTaskEndDate
  );

  const newMainTask = await mainTask.createMainTask();

  if (!newMainTask) {
    throw new BadRequestError("Error in creating main task. Try again later.");
  }

  res.status(StatusCodes.OK).json(newMainTask);
};

export const updateMainTask = async (req, res) => {
  const { main_task_uuid } = req.params;
  const { mainTaskData } = req.body;
  const {
    mainTaskTitle,
    mainTaskBanner,
    mainTaskSubtitle,
    mainTaskDescription,
    mainTaskStatus,
    mainTaskPriority,
    mainTaskStartDate,
    mainTaskEndDate,
  } = mainTaskData;

  const mainTask = await MainTasks.getMainTask(["main_task_uuid"], [main_task_uuid]);

  if (!mainTask) {
    throw new NotFoundError("This task does not exist.");
  }

  const updateTask = await MainTasks.updateMainTask(
    mainTaskBanner,
    mainTaskTitle,
    mainTaskSubtitle,
    mainTaskDescription,
    mainTaskStatus,
    mainTaskPriority,
    mainTaskStartDate,
    mainTaskEndDate,
    mainTask[0]?.main_task_id
  );

  if (!updateTask) {
    throw new BadRequestError("Error in updating task. Try again later.");
  }

  const mainTaskCollaborators = await MainTaskCollaborators.getAllMainTaskCollaborators(
    ["main_task_fk_id"],
    [mainTask[0]?.main_task_id]
  );

  if (!mainTaskCollaborators) {
    throw new BadRequestError("Error in disseminating to members.");
  }

  const mainTaskCollaboratorsUUID = mainTaskCollaborators.map((collaborator) => collaborator.user_uuid);

  res.status(StatusCodes.OK).json({ updateTask, rooms: mainTaskCollaboratorsUUID });
};

export const getMainTask = async (req, res) => {
  const { main_task_uuid } = req.params;

  const mainTask = await MainTasks.getMainTask(["main_task_uuid"], [main_task_uuid]);

  if (!mainTask) {
    throw new NotFoundError("This task does not exist.");
  }

  res.status(StatusCodes.OK).json(mainTask[0]);
};

const getAllMyUpcomingMainTasks = async (req, res) => {
  const { id } = req.user;

  const mainTask = await MainTasks.getAllMyUpcomingMainTasks(["mt.main_task_by"], [id]);

  if (!mainTask) {
    throw new NotFoundError("This task does not exist.");
  }

  res.status(StatusCodes.OK).json(mainTask);
};

const getAllMyMainTasks = async (req, res) => {
  const { id } = req.user;
  const { sortFilter, searchFilter, searchCategory } = req.query;

  const mainTask = await MainTasks.getAllMainTasks(["mt.main_task_by"], [id], sortFilter, searchFilter, searchCategory);

  if (!mainTask) {
    throw new NotFoundError("This task does not exist.");
  }

  res.status(StatusCodes.OK).json(mainTask);
};

const getAllCollaboratedMainTasks = async (req, res) => {
  const { id } = req.user;
  const { sortFilter, searchFilter, searchCategory } = req.query;

  const mainTask = await MainTasks.getAllMainTasks(
    ["mtc.collaborator_fk_id"],
    [id],
    sortFilter,
    searchFilter,
    searchCategory
  );

  if (!mainTask) {
    throw new NotFoundError("This task does not exist.");
  }

  res.status(StatusCodes.OK).json(mainTask);
};

const getAllMyMainTasksToday = async (req, res) => {
  const { id } = req.user;
  const { sortFilter, searchFilter, searchCategory } = req.query;

  const mainTask = await MainTasks.getAllMainTasksToday(
    ["mt.main_task_by"],
    [id],
    sortFilter,
    searchFilter,
    searchCategory
  );

  if (!mainTask) {
    throw new NotFoundError("This task does not exist.");
  }

  res.status(StatusCodes.OK).json(mainTask);
};

const getAllCollaboratedMainTasksToday = async (req, res) => {
  const { id } = req.user;
  const { sortFilter, searchFilter, searchCategory } = req.query;

  const mainTask = await MainTasks.getAllMainTasksToday(
    ["mtc.collaborator_fk_id"],
    [id],
    sortFilter,
    searchFilter,
    searchCategory
  );

  if (!mainTask) {
    throw new NotFoundError("This task does not exist.");
  }

  res.status(StatusCodes.OK).json(mainTask);
};

export const getAllMainTasks = async (req, res) => {
  const { type, which } = req.query;

  if (type === "my" && which === "today") {
    await getAllMyMainTasksToday(req, res);
    return;
  }

  if (type === "collaborated" && which === "today") {
    await getAllCollaboratedMainTasksToday(req, res);
    return;
  }

  if (type === "my" && which === "all") {
    await getAllMyMainTasks(req, res);
    return;
  }

  if (type === "collaborated" && which === "all") {
    await getAllCollaboratedMainTasks(req, res);
    return;
  }

  if (type === "upcoming" && which === "all") {
    await getAllMyUpcomingMainTasks(req, res);
    return;
  }
};

export const deleteMainTask = async (req, res) => {
  const { main_task_uuid } = req.params;

  const mainTask = await MainTasks.getMainTask(["main_task_uuid"], [main_task_uuid]);

  if (!mainTask) {
    throw new NotFoundError("This task does not exist.");
  }

  const mainTaskCollaborators = await MainTaskCollaborators.getAllMainTaskCollaborators(
    ["main_task_fk_id"],
    [mainTask[0]?.main_task_id]
  );

  if (!mainTaskCollaborators) {
    throw new BadRequestError("Error in disseminating to the collaborators.");
  }

  const mainTaskCollaboratorsUUID = mainTaskCollaborators.map((collaborator) => collaborator.user_uuid);

  const deleteTask = await MainTasks.deleteMainTask(["main_task_id"], [mainTask[0]?.main_task_id]);

  if (!deleteTask) {
    throw new BadRequestError("Error in deleting task. Try again later.");
  }

  res.status(StatusCodes.OK).json({ deleteTask, rooms: mainTaskCollaboratorsUUID });
};
