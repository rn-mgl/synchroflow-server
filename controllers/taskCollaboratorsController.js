import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { TaskCollaborators } from "../models/TaskCollaborators.js";
import { Tasks } from "../models/Tasks.js";
import { Users } from "../models/Users.js";

export const createTaskCollaborator = async (req, res) => {
  const { taskUUID, collaboratorUUID } = req.body;
  const taskCollaboratorUUID = uuidv4();

  const task = await Tasks.getTask(["task_uuid"], [taskUUID]);

  if (!task) {
    throw new NotFoundError("The task you are assigning to does not exist.");
  }

  const collaborator = await Users.getUser(["user_uuid"], [collaboratorUUID]);

  if (!collaborator) {
    throw new NotFoundError(
      "The collaborator you are assigning does not exist.",
    );
  }

  const taskCollaborator = new TaskCollaborators(
    taskCollaboratorUUID,
    task[0]?.task_id,
    collaborator[0]?.user_id,
  );

  const newTaskCollaborator = await taskCollaborator.createTaskCollaborator();

  if (!newTaskCollaborator) {
    throw new BadRequestError(
      "Error in adding task collaborator. Try again later.",
    );
  }

  return res.status(StatusCodes.OK).json(newTaskCollaborator);
};

const leaveTask = async (req, res) => {
  const { id } = req.user;
  const { taskUUID } = req.query;

  const task = await Tasks.getTask(["task_uuid"], [taskUUID]);

  if (!task) {
    throw new NotFoundError("The task does not exist.");
  }

  const taskCollaborator = await TaskCollaborators.getTaskCollaborator(
    ["collaborator_fk_id", "task_fk_id"],
    [id, task[0]?.task_id],
  );

  if (!taskCollaborator) {
    throw new NotFoundError("The task collaborator does not exist.");
  }

  const deleteCollaborator = await TaskCollaborators.deleteTaskCollaborator(
    ["task_collaborator_id"],
    [taskCollaborator[0]?.task_collaborator_id],
  );

  if (!deleteCollaborator) {
    throw new BadRequestError(`Error in leaving the task. Try again later.`);
  }

  const taskCollaborators = await TaskCollaborators.getAllMainTaskCollaborators(
    ["task_fk_id"],
    [task[0]?.task_id],
  );

  if (!taskCollaborators) {
    throw new BadRequestError(
      `Error in disseminating to other members. Try again later.`,
    );
  }

  let taskCollaboratorsUUID = taskCollaborators.map(
    (collaborator) => collaborator.user_uuid,
  );
  taskCollaboratorsUUID.push(task[0].user_uuid);

  res
    .status(StatusCodes.OK)
    .json({ deleteCollaborator, rooms: taskCollaboratorsUUID });
};

const deleteCollaborator = async (req, res) => {
  const { task_collaborator_uuid } = req.params;

  const taskCollaborator = await TaskCollaborators.getTaskCollaborator(
    ["task_collaborator_uuid"],
    [task_collaborator_uuid],
  );

  if (!taskCollaborator) {
    throw new NotFoundError("The task collaborator does not exist.");
  }

  const task = await Tasks.getTask(
    ["task_id"],
    [taskCollaborator[0]?.task_fk_id],
  );

  if (!task) {
    throw new NotFoundError(`This task does not exist.`);
  }

  const taskCollaborators = await TaskCollaborators.getAllMainTaskCollaborators(
    ["task_fk_id"],
    [task[0].task_id],
  );

  if (!taskCollaborators) {
    throw new BadRequestError(
      `Error in disseminating to other members. Try again later.`,
    );
  }

  let taskCollaboratorsUUID = taskCollaborators.map(
    (collaborator) => collaborator.user_uuid,
  );

  const deleteCollaborator = await TaskCollaborators.deleteTaskCollaborator(
    ["task_collaborator_id"],
    [taskCollaborator[0]?.task_collaborator_id],
  );

  if (!deleteCollaborator) {
    throw new BadRequestError(`Error in leaving the task. Try again later.`);
  }

  res
    .status(StatusCodes.OK)
    .json({ deleteCollaborator, rooms: taskCollaboratorsUUID });
};

export const deleteTaskCollaborator = async (req, res) => {
  const { type } = req.query;

  if (type === "leave") {
    await leaveTask(req, res);
    return;
  }

  if (type === "delete") {
    await deleteCollaborator(req, res);
    return;
  }
};

const getAllMainTaskCollaborators = async (req, res) => {
  const { taskUUID } = req.query;

  const task = await Tasks.getTask(["t.task_uuid"], [taskUUID]);

  if (!task) {
    throw new NotFoundError(
      `The task you are trying to find collaborators from does not exist.`,
    );
  }

  const allTaskCollaborator =
    await TaskCollaborators.getAllMainTaskCollaborators(
      ["tc.task_fk_id"],
      [task[0]?.task_id],
    );

  if (!allTaskCollaborator) {
    throw new BadRequestError("Error in getting all task collaborators.");
  }

  return res.status(StatusCodes.OK).json(allTaskCollaborator);
};

const getAllSubTaskCollaborators = async (req, res) => {
  const { subTaskUUID } = req.query;

  const task = await Tasks.getTask(["t.task_uuid"], [subTaskUUID]);

  if (!task) {
    throw new NotFoundError(
      `The task you are trying to find collaborators from does not exist.`,
    );
  }

  const allTaskCollaborator =
    await TaskCollaborators.getAllSubTaskCollaborators(
      task[0]?.task_id,
      task[0]?.parent_task,
    );

  if (!allTaskCollaborator) {
    throw new BadRequestError("Error in getting all task collaborators.");
  }

  return res.status(StatusCodes.OK).json(allTaskCollaborator);
};

export const getAllTaskCollaborator = async (req, res) => {
  const { type } = req.query;

  if (type === "main") {
    return await getAllMainTaskCollaborators(req, res);
  }

  if (type === "sub") {
    return await getAllSubTaskCollaborators(req, res);
  }
};

export const getTaskCollaborator = async (req, res) => {
  const { task_collaborator_uuid } = req.params;

  const taskCollaborator = await TaskCollaborators.getTaskCollaborator(
    ["task_collaborator_uuid"],
    [task_collaborator_uuid],
  );

  if (!taskCollaborator) {
    throw new NotFoundError("The task collaborator does not exist.");
  }

  return res.status(StatusCodes.OK).json(taskCollaborator[0]);
};
