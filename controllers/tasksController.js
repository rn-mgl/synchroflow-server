import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { Tasks } from "../models/Tasks.js";
import { TaskCollaborators } from "../models/TaskCollaborators.js";

export const createTask = async (req, res) => {
  const { taskData, parentTask } = req.body;
  const {
    taskBanner,
    taskTitle,
    taskSubtitle,
    taskDescription,
    taskPriority,
    taskStartDate,
    taskEndDate,
  } = taskData;

  const taskUUID = uuidv4();
  const { id } = req.user;

  let parentId = null;

  if (parentTask !== null) {
    const parent = await Tasks.getTask(["task_uuid"], [parentTask]);
    parentId = parent[0]?.task_id ?? null;
  }

  const task = new Tasks(
    taskUUID,
    id,
    parentId,
    taskBanner,
    taskTitle,
    taskSubtitle,
    taskDescription,
    taskPriority,
    taskStartDate,
    taskEndDate,
  );

  const newTask = await task.createTask();

  if (!newTask) {
    throw new BadRequestError("Error in creating task. Try again later.");
  }

  return res.status(StatusCodes.OK).json(newTask);
};

export const updateTask = async (req, res) => {
  const { task_uuid } = req.params;
  const { taskData } = req.body;
  const {
    taskTitle,
    taskBanner,
    taskSubtitle,
    taskDescription,
    taskStatus,
    taskPriority,
    taskStartDate,
    taskEndDate,
  } = taskData;

  const task = await Tasks.getTask(["task_uuid"], [task_uuid]);

  if (!task) {
    throw new NotFoundError("This task does not exist.");
  }

  const updateTask = await Tasks.updateTask(
    taskBanner,
    taskTitle,
    taskSubtitle,
    taskDescription,
    taskStatus,
    taskPriority,
    taskStartDate,
    taskEndDate,
    task[0]?.task_id,
  );

  if (!updateTask) {
    throw new BadRequestError("Error in updating task. Try again later.");
  }

  const taskCollaborators = await TaskCollaborators.getAllMainTaskCollaborators(
    ["task_fk_id"],
    [task[0]?.task_id],
  );

  if (!taskCollaborators) {
    throw new BadRequestError("Error in disseminating to members.");
  }

  const taskCollaboratorsUUID = taskCollaborators.map(
    (collaborator) => collaborator.user_uuid,
  );

  return res
    .status(StatusCodes.OK)
    .json({ updateTask, rooms: taskCollaboratorsUUID });
};

export const getTask = async (req, res) => {
  const { task_uuid } = req.params;

  const task = await Tasks.getTask(["task_uuid"], [task_uuid]);

  if (!task) {
    throw new NotFoundError("This task does not exist.");
  }

  return res.status(StatusCodes.OK).json(task[0]);
};

const getAllMyUpcomingTasks = async (req, res) => {
  const { id } = req.user;

  const task = await Tasks.getAllMyUpcomingTasks(["t.task_by"], [id]);

  if (!task) {
    throw new NotFoundError("This task does not exist.");
  }

  return res.status(StatusCodes.OK).json(task);
};

const getAllMyTasks = async (req, res) => {
  const { id } = req.user;

  const task = await Tasks.getAllTasks(["t.task_by"], [id]);

  if (!task) {
    throw new NotFoundError("This task does not exist.");
  }

  return res.status(StatusCodes.OK).json(task);
};

const getAllCollaboratedTasks = async (req, res) => {
  const { id } = req.user;

  const task = await Tasks.getAllTasks(["tc.collaborator_fk_id"], [id]);

  if (!task) {
    throw new NotFoundError("This task does not exist.");
  }

  return res.status(StatusCodes.OK).json(task);
};

const getAllMyTasksToday = async (req, res) => {
  const { id } = req.user;

  const task = await Tasks.getAllTasksToday(["t.task_by"], [id]);

  if (!task) {
    throw new NotFoundError("This task does not exist.");
  }

  return res.status(StatusCodes.OK).json(task);
};

const getAllCollaboratedTasksToday = async (req, res) => {
  const { id } = req.user;

  const task = await Tasks.getAllTasksToday(["tc.collaborator_fk_id"], [id]);

  if (!task) {
    throw new NotFoundError("This task does not exist.");
  }

  return res.status(StatusCodes.OK).json(task);
};

const getAllCreatedSubTasks = async (req, res) => {
  const { taskUUID } = req.query;

  const task = await Tasks.getTask(["task_uuid"], [taskUUID]);

  if (!task || !task[0]) {
    throw new NotFoundError(`No task found.`);
  }

  const subTasks = await Tasks.getAllTasks(["parent_task"], [task[0]?.task_id]);

  return res.status(StatusCodes.OK).json(subTasks);
};

const getAllAssignedSubTasks = async (req, res) => {
  const { taskUUID } = req.query;
  const { id } = req.user;

  const task = await Tasks.getTask(["task_uuid"], [taskUUID]);

  if (!task || !task[0]) {
    throw new NotFoundError(`No task found.`);
  }

  const subTasks = await Tasks.getAllTasks(
    ["parent_task", "tc.collaborator_fk_id"],
    [task[0]?.task_id, id],
  );

  return res.status(StatusCodes.OK).json(subTasks);
};

export const getAllTasks = async (req, res) => {
  const { type, which } = req.query;

  if (type === "my" && which === "today") {
    return await getAllMyTasksToday(req, res);
  }

  if (type === "collaborated" && which === "today") {
    return await getAllCollaboratedTasksToday(req, res);
  }

  if (type === "my" && which === "all") {
    return await getAllMyTasks(req, res);
  }

  if (type === "collaborated" && which === "all") {
    return await getAllCollaboratedTasks(req, res);
  }

  if (type === "upcoming" && which === "all") {
    return await getAllMyUpcomingTasks(req, res);
  }

  if (type === "created") {
    return await getAllCreatedSubTasks(req, res);
  }

  if (type === "assigned") {
    return await getAllAssignedSubTasks(req, res);
  }
};

export const deleteTask = async (req, res) => {
  const { task_uuid } = req.params;

  const task = await Tasks.getTask(["task_uuid"], [task_uuid]);

  if (!task) {
    throw new NotFoundError("This task does not exist.");
  }

  const taskCollaborators = await TaskCollaborators.getAllMainTaskCollaborators(
    ["task_fk_id"],
    [task[0]?.task_id],
  );

  if (!taskCollaborators) {
    throw new BadRequestError("Error in disseminating to the collaborators.");
  }

  const taskCollaboratorsUUID = taskCollaborators.map(
    (collaborator) => collaborator.user_uuid,
  );

  const deleteTask = await Tasks.deleteTask(["task_id"], [task[0]?.task_id]);

  if (!deleteTask) {
    throw new BadRequestError("Error in deleting task. Try again later.");
  }

  return res
    .status(StatusCodes.OK)
    .json({ deleteTask, rooms: taskCollaboratorsUUID });
};
