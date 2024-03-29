import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { SubTaskCollaborators } from "../models/SubTaskCollaborators.js";
import { SubTasks } from "../models/SubTasks.js";
import { Users } from "../models/Users.js";
import { MainTasks } from "../models/MainTasks.js";

export const createSubTaskCollaborator = async (req, res) => {
  const { subTaskUUID, collaboratorUUID } = req.body;
  const subTaskCollaboratorUUID = uuidv4();

  const subTask = await SubTasks.getSubTask(["sub_task_uuid"], [subTaskUUID]);

  if (!subTask) {
    throw new NotFoundError("The sub task you are assigning to does not exist.");
  }

  const user = await Users.getUser(["user_uuid"], [collaboratorUUID]);

  if (!user) {
    throw new NotFoundError("The user you are assigning does not exist.");
  }

  const subTaskCollaborator = new SubTaskCollaborators(
    subTaskCollaboratorUUID,
    subTask[0]?.sub_task_id,
    user[0]?.user_id
  );

  const newSubTaskCollaborator = await subTaskCollaborator.createSubTaskCollaborator();

  if (!newSubTaskCollaborator) {
    throw new BadRequestError("Error in adding sub task collaborator. Try again later.");
  }

  res.status(StatusCodes.OK).json(newSubTaskCollaborator);
};

export const deleteSubTaskCollaborator = async (req, res) => {
  const { sub_task_collaborator_uuid } = req.params;

  const subTaskCollaborator = await SubTaskCollaborators.getSubTaskCollaborator(
    ["sub_task_collaborator_uuid"],
    [sub_task_collaborator_uuid]
  );

  if (!subTaskCollaborator) {
    throw new NotFoundError("The task collaborator does not exist.");
  }

  const deleteCollaborator = await SubTaskCollaborators.deleteSubTaskCollaborator(
    ["sub_task_collaborator_id"],
    [subTaskCollaborator[0]?.sub_task_collaborator_id]
  );

  res.status(StatusCodes.OK).json(deleteCollaborator);
};

export const getAllSubTaskCollaborators = async (req, res) => {
  const { subTaskUUID, mainTaskUUID } = req.query;

  const mainTask = await MainTasks.getMainTask(["main_task_uuid"], [mainTaskUUID]);

  if (!mainTask) {
    throw new NotFoundError(`The main task you are trying to get does not exist.`);
  }

  const subTask = await SubTasks.getSubTask(["sub_task_uuid"], [subTaskUUID]);

  if (!subTask) {
    throw new NotFoundError(`The sub task you are trying to get does not exist.`);
  }

  const allSubTaskCollaborator = await SubTaskCollaborators.getAllSubTaskCollaborators(
    subTask[0]?.sub_task_id,
    mainTask[0]?.main_task_id
  );

  if (!allSubTaskCollaborator) {
    throw new BadRequestError("Error in getting all sub task collaborators.");
  }

  res.status(StatusCodes.OK).json(allSubTaskCollaborator);
};

export const getSubTaskCollaborator = async (req, res) => {
  const { sub_task_collaborator_uuid } = req.params;

  const subTaskCollaborator = await SubTaskCollaborators.getSubTaskCollaborator(
    ["sub_task_collaborator_uuid"],
    [sub_task_collaborator_uuid]
  );

  if (!subTaskCollaborator) {
    throw new NotFoundError("The task collaborator does not exist.");
  }

  res.status(StatusCodes.OK).json(subTaskCollaborator[0]);
};
