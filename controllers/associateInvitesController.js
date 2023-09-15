import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors";
import { AssociateInvites } from "../models/AssociateInvites";
import { Users } from "../models/Users.js";
import { v4 as uuidv4 } from "uuid";

export const createAssociateInvite = async (req, res) => {
  const { inviteTo } = req.body;
  const { id } = req.user;

  const invitedUser = await Users.getUser("user_id", inviteTo);

  if (!invitedUser) {
    throw new BadRequestError(`This user does not exist in Synchroflow.`);
  }

  const associateInviteUUID = uuidv4();

  const associateInvites = new AssociateInvites(associateInviteUUID, id, inviteTo);

  const newAssociateInvite = await associateInvites.createAssociateInvite();

  if (!newAssociateInvite) {
    throw new BadRequestError("Error in sending invite. Try again later.");
  }

  res.status(StatusCodes.OK).json(newAssociateInvite);
};

export const updateAssociateInviteStatus = async (req, res) => {
  const { inviteStatus } = req.body;
  const { associate_invite_uuid } = req.params;

  const associateInvite = await AssociateInvites.getAssociateInvite("associate_invite_uuid", associate_invite_uuid);

  if (!associateInvite) {
    throw new NotFoundError("This invite no longer exist.");
  }

  const updateInviteStatus = await AssociateInvites.updateAssociateInviteStatus(
    inviteStatus,
    "associate_invite_id",
    associateInvite.associate_invite_id
  );

  if (!updateInviteStatus) {
    throw new BadRequestError("Error in updating invite status. Try again later.");
  }

  res.status(StatusCodes.OK).json(updateInviteStatus);
};

export const getAssociateInvite = async (req, res) => {
  const { associate_invite_uuid } = req.params;

  const associateInvite = await AssociateInvites.getAssociateInvite("associate_invite_uuid", associate_invite_uuid);

  if (!associateInvite) {
    throw new BadRequestError("Error in getting associate invite.");
  }

  res.status(StatusCodes.OK).json(associateInvite);
};

const getAllSentAssociateInvite = async (req, res) => {
  const { id } = req.user;

  const associateInvites = await AssociateInvites.getAllAssociateInvites("associate_invite_from", id);

  if (!associateInvites) {
    throw new BadRequestError("Error in getting all associate invites.");
  }

  res.status(StatusCodes.OK).json(associateInvites);
};

const getAllReceivedAssociateInvite = async (req, res) => {
  const { id } = req.user;

  const associateInvites = await AssociateInvites.getAllAssociateInvites("associate_invite_to", id);

  if (!associateInvites) {
    throw new BadRequestError("Error in getting all associate invites.");
  }

  res.status(StatusCodes.OK).json(associateInvites);
};

export const getAllAssociateInvites = async (req, res) => {
  const { type } = req.query;

  switch (type) {
    case "sent":
      await getAllSentAssociateInvite(req, res);
      return;

    case "received":
      await getAllReceivedAssociateInvite(req, res);
      return;

    default:
      return;
  }
};

export const deleteAssociateInvite = async (req, res) => {
  const { associate_invite_uuid } = req.params;

  const deleteInvite = await AssociateInvites.deleteAssociateInvite("associate_invite_uuid", associate_invite_uuid);

  if (!deleteAssociateInvite) {
    throw new BadRequestError("Error in deleting the invite. Try again later.");
  }

  res.status(StatusCodes.OK).json(deleteInvite);
};
