import { v4 as uuidv4 } from "uuid";
import { PrivateMessageMembers } from "../models/PrivateMessageMembers.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { PrivateMessageRooms } from "../models/PrivateMessageRooms.js";

export const createPrivateMessageMember = async (req, res) => {
  const { memberId, roomId } = req.body;
  const privateMessageMemberUUID = uuidv4();

  const privateMessageMember = new PrivateMessageMembers(privateMessageMemberUUID, memberId, roomId);

  const newPrivateMessageMember = await privateMessageMember.createPrivateMessageMember();

  if (!newPrivateMessageMember) {
    throw new BadRequestError("Error in adding user in the private message.");
  }

  res.status(StatusCodes.OK).json(newPrivateMessageMember);
};

export const deletePrivateMessageMember = async (req, res) => {
  const { message_member_uuid } = req.params;

  const privateMessageMember = await PrivateMessageMembers.getPrivateMessageMember(
    ["message_member_uuid"],
    [message_member_uuid]
  );

  if (!privateMessageMember) {
    throw new NotFoundError("This private message member does not exist.");
  }

  const deleteMember = await PrivateMessageMembers.deletePrivateMessageMember(
    ["message_member_id"],
    [privateMessageMember.message_member_id]
  );

  if (!deleteMember) {
    throw new BadRequestError("Error in deleting user in the private message.");
  }

  res.status(StatusCodes.OK).json(deleteMember);
};

export const getAllPrivateMessageMembers = async (req, res) => {
  const { privateMessageRoomId } = req.body;

  const privateMessageRoom = await PrivateMessageRooms.getPrivateMessageRoomMessages(
    ["message_room_id"],
    [privateMessageRoomId]
  );

  if (!privateMessageRoom) {
    throw new NotFoundError("This private message room does not exist.");
  }

  const allPrivateMessageMembers = await PrivateMessageMembers.getAllPrivateMessageMembers(
    ["message_room_id"],
    [privateMessageRoomId]
  );

  if (!allPrivateMessageMembers) {
    throw new BadRequestError("Error in getting all members in the private message.");
  }

  res.status(StatusCodes.OK).json(allPrivateMessageMembers);
};

export const getPrivateMessageMember = async (req, res) => {
  const { message_member_uuid } = req.params;

  const privateMessageMember = await PrivateMessageMembers.getPrivateMessageMember(
    ["message_member_uuid"],
    [message_member_uuid]
  );

  if (!privateMessageMember) {
    throw new NotFoundError("This private message member does not exist.");
  }

  res.status(StatusCodes.OK).json(privateMessageMember);
};
