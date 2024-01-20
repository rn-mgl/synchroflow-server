import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { MainTaskCollaborators } from "../models/MainTaskCollaborators.js";
import { MainTasks } from "../models/MainTasks.js";
import { Users } from "../models/Users.js";

export const createMainTaskCollaborator = async (req, res) => {
  const { mainTaskUUID, collaboratorUUID } = req.body;
  const mainTaskCollaboratorUUID = uuidv4();

  const mainTask = await MainTasks.getMainTask(["main_task_uuid"], [mainTaskUUID]);

  if (!mainTask) {
    throw new NotFoundError("The main task you are assigning to does not exist.");
  }

  const collaborator = await Users.getUser(["user_uuid"], [collaboratorUUID]);

  if (!collaborator) {
    throw new NotFoundError("The collaborator you are assigning does not exist.");
  }

  const mainTaskCollaborator = new MainTaskCollaborators(
    mainTaskCollaboratorUUID,
    mainTask[0]?.main_task_id,
    collaborator[0]?.user_id
  );

  const newMainTaskCollaborator = await mainTaskCollaborator.createMainTaskCollaborator();

  if (!newMainTaskCollaborator) {
    throw new BadRequestError("Error in adding main task collaborator. Try again later.");
  }

  res.status(StatusCodes.OK).json(newMainTaskCollaborator);
};

const leaveMainTask = async (req, res) => {
  const { id } = req.user;
  const { mainTaskUUID } = req.query;

  const mainTask = await MainTasks.getMainTask(["main_task_uuid"], [mainTaskUUID]);

  if (!mainTask) {
    throw new NotFoundError("The task does not exist.");
  }

  const mainTaskCollaborator = await MainTaskCollaborators.getMainTaskCollaborator(
    ["collaborator_fk_id", "main_task_fk_id"],
    [id, mainTask[0]?.main_task_id]
  );

  if (!mainTaskCollaborator) {
    throw new NotFoundError("The task collaborator does not exist.");
  }

  const deleteCollaborator = await MainTaskCollaborators.deleteMainTaskCollaborator(
    ["main_task_collaborator_id"],
    [mainTaskCollaborator[0]?.main_task_collaborator_id]
  );

  if (!deleteCollaborator) {
    throw new BadRequestError(`Error in leaving the task. Try again later.`);
  }

  const mainTaskCollaborators = await MainTaskCollaborators.getAllMainTaskCollaborators(
    ["main_task_fk_id"],
    [mainTask[0]?.main_task_id]
  );

  if (!mainTaskCollaborators) {
    throw new BadRequestError(`Error in disseminating to other members. Try again later.`);
  }

  let mainTaskCollaboratorsUUID = mainTaskCollaborators.map((collaborator) => collaborator.user_uuid);
  mainTaskCollaboratorsUUID.push(mainTask[0].user_uuid);

  res.status(StatusCodes.OK).json({ deleteCollaborator, rooms: mainTaskCollaboratorsUUID });
};

const deleteCollaborator = async (req, res) => {
  const { main_task_collaborator_uuid } = req.params;

  const mainTaskCollaborator = await MainTaskCollaborators.getMainTaskCollaborator(
    ["main_task_collaborator_uuid"],
    [main_task_collaborator_uuid]
  );

  if (!mainTaskCollaborator) {
    throw new NotFoundError("The task collaborator does not exist.");
  }

  const deleteCollaborator = await MainTaskCollaborators.deleteMainTaskCollaborator(
    ["main_task_collaborator_id"],
    [mainTaskCollaborator[0]?.main_task_collaborator_id]
  );

  res.status(StatusCodes.OK).json(deleteCollaborator);
};

export const deleteMainTaskCollaborator = async (req, res) => {
  const { type } = req.query;

  if (type === "leave") {
    await leaveMainTask(req, res);
    return;
  }

  if (type === "delete") {
    await deleteCollaborator(req, res);
    return;
  }
};

export const getAllMainTaskCollaborator = async (req, res) => {
  const { mainTaskUUID } = req.query;

  const mainTask = await MainTasks.getMainTask(["mt.main_task_uuid"], [mainTaskUUID]);

  if (!mainTask) {
    throw new NotFoundError(`The task you are trying to find collaborators from does not exist.`);
  }

  const allMainTaskCollaborator = await MainTaskCollaborators.getAllMainTaskCollaborators(
    ["mtc.main_task_fk_id"],
    [mainTask[0]?.main_task_id]
  );

  if (!allMainTaskCollaborator) {
    throw new BadRequestError("Error in getting all main task collaborators.");
  }

  res.status(StatusCodes.OK).json(allMainTaskCollaborator);
};

export const getMainTaskCollaborator = async (req, res) => {
  const { main_task_collaborator_uuid } = req.params;

  const mainTaskCollaborator = await MainTaskCollaborators.getMainTaskCollaborator(
    ["main_task_collaborator_uuid"],
    [main_task_collaborator_uuid]
  );

  if (!mainTaskCollaborator) {
    throw new NotFoundError("The task collaborator does not exist.");
  }

  res.status(StatusCodes.OK).json(mainTaskCollaborator[0]);
};
