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
  const { private_message_member_uuid } = req.params;

  const privateMessageMember = await PrivateMessageMembers.getPrivateMessageMember(
    "private_message_member_uuid",
    private_message_member_uuid
  );

  if (!privateMessageMember) {
    throw new NotFoundError("This private message member does not exist.");
  }

  const deleteMember = await PrivateMessageMembers.deletePrivateMessageMember(
    "private_message_member_id",
    privateMessageMember.private_message_member_id
  );

  if (!deleteMember) {
    throw new BadRequestError("Error in deleting user in the private message.");
  }

  res.status(StatusCodes.OK).json(deleteMember);
};

export const getAllPrivateMessageMembers = async (req, res) => {
  const { privateMessageRoomId } = req.body;

  const privateMessageRoom = await PrivateMessageRooms.getPrivateMessageRoom(
    "private_message_room_id",
    privateMessageRoomId
  );

  if (!privateMessageRoom) {
    throw new NotFoundError("This private message room does not exist.");
  }

  const allPrivateMessageMembers = await PrivateMessageMembers.getAllPrivateMessageMembers(
    "private_message_room_id",
    privateMessageRoomId
  );

  if (!allPrivateMessageMembers) {
    throw new BadRequestError("Error in getting all members in the private message.");
  }

  res.status(StatusCodes.OK).json(allPrivateMessageMembers);
};
