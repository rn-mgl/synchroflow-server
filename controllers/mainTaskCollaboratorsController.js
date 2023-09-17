import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { MainTaskCollaborators } from "../models/MainTaskCollaborators.js";
import { MainTasks } from "../models/MainTasks.js";

export const createMainTaskCollaborator = async (req, res) => {
  const { taskId, collaboratorId } = req.body;
  const mainTaskCollaboratorUUID = uuidv4();

  const mainTask = await MainTasks.getMainTask("main_task_id", taskId);

  if (!mainTask) {
    throw new NotFoundError("The main task you are assigning to does not exist.");
  }

  const mainTaskCollaborator = new MainTaskCollaborators(
    mainTaskCollaboratorUUID,
    mainTask.main_task_id,
    collaboratorId
  );

  const newMainTaskCollaborator = await mainTaskCollaborator.createMainTaskCollaborator();

  if (!newMainTaskCollaborator) {
    throw new BadRequestError("Error in adding main task collaborator. Try again later.");
  }

  res.status(StatusCodes.OK).json(newMainTaskCollaborator);
};

export const deleteMainTaskCollaborator = async (req, res) => {
  const { main_task_collaborator_uuid } = req.params;

  const mainTaskCollaborator = await MainTaskCollaborators.getMainTaskCollaborator(
    "main_task_collaborator_uuid",
    main_task_collaborator_uuid
  );

  if (!mainTaskCollaborator) {
    throw new NotFoundError("The task collaborator does not exist.");
  }

  const deleteCollaborator = await MainTaskCollaborators.deleteMainTaskCollaborator(
    "main_task_collaborator_id",
    mainTaskCollaborator.main_task_collaborator_id
  );

  res.status(StatusCodes.OK).json(deleteCollaborator);
};

export const getAllMainTaskCollaborator = async (req, res) => {
  const { taskId } = req.query;

  const allMainTaskCollaborator = await MainTaskCollaborators.getAllMainTaskCollaborators("mtc.main_task_id", taskId);

  if (!allMainTaskCollaborator) {
    throw new BadRequestError("Error in getting all main task collaborators.");
  }

  res.status(StatusCodes.OK).json(allMainTaskCollaborator);
};
