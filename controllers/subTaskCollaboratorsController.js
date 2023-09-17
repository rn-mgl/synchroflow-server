import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { SubTaskCollaborators } from "../models/SubTaskCollaborators.js";
import { SubTasks } from "../models/SubTasks.js";

export const createSubTaskCollaborator = async (req, res) => {
  const { taskId, collaboratorId } = req.body;
  const subTaskCollaboratorUUID = uuidv4();

  const subTask = await SubTasks.getSubTask("sub_task_id", taskId);

  if (!subTask) {
    throw new NotFoundError("The sub task you are assigning to does not exist.");
  }

  const subTaskCollaborator = new SubTaskCollaborators(subTaskCollaboratorUUID, subTask.sub_task_id, collaboratorId);

  const newSubTaskCollaborator = await subTaskCollaborator.createSubTaskCollaborator();

  if (!newSubTaskCollaborator) {
    throw new BadRequestError("Error in adding sub task collaborator. Try again later.");
  }

  res.status(StatusCodes.OK).json(newSubTaskCollaborator);
};

export const deleteSubTaskCollaborator = async (req, res) => {
  const { sub_task_collaborator_uuid } = req.params;

  const subTaskCollaborator = await SubTaskCollaborators.getSubTaskCollaborator(
    "sub_task_collaborator_uuid",
    sub_task_collaborator_uuid
  );

  if (!subTaskCollaborator) {
    throw new NotFoundError("The task collaborator does not exist.");
  }

  const deleteCollaborator = await SubTaskCollaborators.deleteSubTaskCollaborator(
    "sub_task_collaborator_id",
    subTaskCollaborator.sub_task_collaborator_id
  );

  res.status(StatusCodes.OK).json(deleteCollaborator);
};

export const getAllSubTaskCollaborator = async (req, res) => {
  const { taskId } = req.query;

  const allSubTaskCollaborator = await SubTaskCollaborators.getAllSubTaskCollaborators("stc.sub_task_id", taskId);

  if (!allSubTaskCollaborator) {
    throw new BadRequestError("Error in getting all sub task collaborators.");
  }

  res.status(StatusCodes.OK).json(allSubTaskCollaborator);
};

export const getSubTaskCollaborator = async (req, res) => {
  const { sub_task_collaborator_uuid } = req.params;

  const subTaskCollaborator = await SubTaskCollaborators.getSubTaskCollaborator(
    "sub_task_collaborator_uuid",
    sub_task_collaborator_uuid
  );

  if (!subTaskCollaborator) {
    throw new NotFoundError("The task collaborator does not exist.");
  }

  res.status(StatusCodes.OK).json(subTaskCollaborator);
};
