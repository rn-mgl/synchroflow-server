import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { SubTasks } from "../models/SubTasks.js";
import { SubTaskInvites } from "../models/SubTaskInvites.js";

export const createSubTaskInvite = async (req, res) => {
  const { taskId, invitedAssociate, inviteMessage } = req.body;
  const { id } = req.user;
  const subTaskInviteUUID = uuidv4();

  const subTask = await SubTasks.getSubTask("sub_task_id", taskId);

  if (!subTask) {
    throw new NotFoundError("The task you are inviting someone to does not exist.");
  }

  const subTaskInvite = new SubTaskInvites(subTaskInviteUUID, subTask.sub_task_id, id, invitedAssociate, inviteMessage);

  const newSubTaskInvite = await subTaskInvite.createSubTaskInvite();

  if (!newSubTaskInvite) {
    throw new BadRequestError("Error in inviting someone. Try again later.");
  }

  res.status(StatusCodes.OK).json(newSubTaskInvite);
};

export const deleteSubTaskInvite = async (req, res) => {
  const { sub_task_invite_uuid } = req.params;

  const subTaskInvite = await SubTaskInvites.getSubTaskInvite("sub_task_invite_uuid", sub_task_invite_uuid);

  if (!subTaskInvite) {
    throw new NotFoundError("The invite does not exist.");
  }

  const deleteInvite = await SubTaskInvites.deleteSubTaskInvite("sub_task_invite_id", subTaskInvite.sub_task_invite_id);

  if (!deleteInvite) {
    throw new BadRequestError("Error in deleting invite. Try again later.");
  }

  res.status(StatusCodes.OK).json(deleteInvite);
};

export const updateSubTaskInviteStatus = async (req, res) => {
  const { inviteStatus } = req.body;
  const { sub_task_invite_uuid } = req.params;

  const subTaskInvite = await SubTaskInvites.getSubTaskInvite("sub_task_invite_uuid", sub_task_invite_uuid);

  if (!subTaskInvite) {
    throw new NotFoundError("The invite does not exist.");
  }

  const updateInvite = await SubTaskInvites.updateSubTaskInviteStatus(
    inviteStatus,
    "sub_task_invite_id",
    subTaskInvite.sub_task_invite_id
  );

  if (!updateInvite) {
    throw new BadRequestError("Error in updating invite status. Try again later.");
  }

  res.status(StatusCodes.OK).json(updateInvite);
};

export const getSubTaskInvite = async (req, res) => {
  const { sub_task_invite_uuid } = req.params;

  const subTaskInvite = await SubTaskInvites.getSubTaskInvite("sub_task_invite_uuid", sub_task_invite_uuid);

  if (!subTaskInvite) {
    throw new NotFoundError("The invite does not exist.");
  }

  res.status(StatusCodes.OK).json(subTaskInvite);
};

const getAllSentSubTaskInvites = async (req, res) => {
  const { id } = req.user;

  const allSubTaskInvites = await SubTaskInvites.getAllSubTaskInvites("invited_by", id);

  if (!allSubTaskInvites) {
    throw new BadRequestError("Error in getting all your sent sub task invites.");
  }

  res.status(StatusCodes.OK).json(allSubTaskInvites);
};

const getAllReceivedSubTaskInvites = async (req, res) => {
  const { id } = req.user;

  const allSubTaskInvites = await SubTaskInvites.getAllSubTaskInvites("invited_associate", id);

  if (!allSubTaskInvites) {
    throw new BadRequestError("Error in getting all your received sub task invites.");
  }

  res.status(StatusCodes.OK).json(allSubTaskInvites);
};

export const getAllSubTaskInvites = async (req, res) => {
  const { type } = req.query;

  switch (type) {
    case "sent":
      await getAllSentSubTaskInvites(req, res);
      return;

    case "received":
      await getAllReceivedSubTaskInvites(req, res);
      return;

    default:
      return;
  }
};
