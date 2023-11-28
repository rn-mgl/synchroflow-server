import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { MainTasks } from "../models/MainTasks.js";
import { MainTaskInvites } from "../models/MainTaskInvites.js";
import { Users } from "../models/Users.js";

export const createMainTaskInvite = async (req, res) => {
  const { taskUUID, associatesToInvite, inviteMessage } = req.body;
  const { id } = req.user;
  const mainTaskInviteUUID = uuidv4();

  const mainTask = await MainTasks.getMainTask("main_task_uuid", taskUUID);

  if (!mainTask) {
    throw new NotFoundError("The task you are inviting someone to does not exist.");
  }

  associatesToInvite.map(async (associate) => {
    const invitedUser = await Users.getUser("user_uuid", associate);

    if (!invitedUser) {
      throw new NotFoundError(`A user does not exist in Synchroflow.`);
    }

    const mainTaskInvite = new MainTaskInvites(
      mainTaskInviteUUID,
      mainTask.main_task_id,
      id,
      invitedUser.user_id,
      inviteMessage
    );

    const newMainTaskInvite = await mainTaskInvite.createMainTaskInvite();

    if (!newMainTaskInvite) {
      throw new BadRequestError("Error in inviting someone. Try again later.");
    }
  });

  res.status(StatusCodes.OK).json({ msg: "Sent successfully" });
};

export const deleteMainTaskInvite = async (req, res) => {
  const { main_task_invite_uuid } = req.params;

  const mainTaskInvite = await MainTaskInvites.getMainTaskInvite("main_task_invite_uuid", main_task_invite_uuid);

  if (!mainTaskInvite) {
    throw new NotFoundError("The invite does not exist.");
  }

  const deleteInvite = await MainTaskInvites.deleteMainTaskInvite(
    "main_task_invite_id",
    mainTaskInvite.main_task_invite_id
  );

  if (!deleteInvite) {
    throw new BadRequestError("Error in deleting invite. Try again later.");
  }

  res.status(StatusCodes.OK).json(deleteInvite);
};

export const updateMainTaskInviteStatus = async (req, res) => {
  const { inviteStatus } = req.body;
  const { main_task_invite_uuid } = req.params;

  const mainTaskInvite = await MainTaskInvites.getMainTaskInvite("main_task_invite_uuid", main_task_invite_uuid);

  if (!mainTaskInvite) {
    throw new NotFoundError("The invite does not exist.");
  }

  const updateInvite = await MainTaskInvites.updateMainTaskInviteStatus(
    inviteStatus,
    "main_task_invite_id",
    mainTaskInvite.main_task_invite_id
  );

  if (!updateInvite) {
    throw new BadRequestError("Error in updating invite status. Try again later.");
  }

  res.status(StatusCodes.OK).json(updateInvite);
};

export const getMainTaskInvite = async (req, res) => {
  const { main_task_invite_uuid } = req.params;

  const mainTaskInvite = await MainTaskInvites.getMainTaskInvite("main_task_invite_uuid", main_task_invite_uuid);

  if (!mainTaskInvite) {
    throw new NotFoundError("The invite does not exist.");
  }

  res.status(StatusCodes.OK).json(mainTaskInvite);
};

const getAllSentMainTaskInvites = async (req, res) => {
  const { id } = req.user;

  const allMainTaskInvites = await MainTaskInvites.getAllMainTaskInvites("invited_by", id);

  if (!allMainTaskInvites) {
    throw new BadRequestError("Error in getting all your sent main task invites.");
  }

  res.status(StatusCodes.OK).json(allMainTaskInvites);
};

const getAllReceivedMainTaskInvites = async (req, res) => {
  const { id } = req.user;

  const allMainTaskInvites = await MainTaskInvites.getAllMainTaskInvites("invited_associate", id);

  if (!allMainTaskInvites) {
    throw new BadRequestError("Error in getting all your received main task invites.");
  }

  res.status(StatusCodes.OK).json(allMainTaskInvites);
};

const getAllAssociatesToInvite = async (req, res) => {
  const { id } = req.user;
  const { mainTaskUUID } = req.query;

  const mainTask = await MainTasks.getMainTask("main_task_uuid", mainTaskUUID);

  if (!mainTask) {
    throw new NotFoundError(`The main task you are inviting someone to does not exist.`);
  }

  const allMainTaskInvites = await MainTaskInvites.getAllAssociatesToInvite("a.associate_of", id);

  if (!allMainTaskInvites) {
    throw new BadRequestError("Error in getting all your received main task invites.");
  }

  res.status(StatusCodes.OK).json(allMainTaskInvites);
};

export const getAllMainTaskInvites = async (req, res) => {
  const { type } = req.query;

  switch (type) {
    case "sent":
      await getAllSentMainTaskInvites(req, res);
      return;

    case "received":
      await getAllReceivedMainTaskInvites(req, res);
      return;

    case "invite associates":
      await getAllAssociatesToInvite(req, res);
      return;

    default:
      return;
  }
};
