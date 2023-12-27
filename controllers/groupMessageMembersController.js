import { v4 as uuidv4 } from "uuid";
import { GroupMessageMembers } from "../models/GroupMessageMembers.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { GroupMessageRooms } from "../models/GroupMessageRooms.js";

export const createGroupMessageMember = async (req, res) => {
  const { memberId, roomId } = req.body;
  const groupMessageMemberUUID = uuidv4();

  const groupMessageMember = new GroupMessageMembers(groupMessageMemberUUID, memberId, roomId);

  const newGroupMessageMember = await groupMessageMember.createGroupMessageMember();

  if (!newGroupMessageMember) {
    throw new BadRequestError("Error in adding user in the group message.");
  }

  res.status(StatusCodes.OK).json(newGroupMessageMember);
};

export const deleteGroupMessageMember = async (req, res) => {
  const { message_member_uuid } = req.params;

  const groupMessageMember = await GroupMessageMembers.getGroupMessageMember(
    ["message_member_uuid"],
    [message_member_uuid]
  );

  if (!groupMessageMember) {
    throw new NotFoundError("This group message member does not exist.");
  }

  const deleteMember = await GroupMessageMembers.deleteGroupMessageMember(
    ["message_member_id"],
    [groupMessageMember.message_member_id]
  );

  if (!deleteMember) {
    throw new BadRequestError("Error in deleting user in the group message.");
  }

  res.status(StatusCodes.OK).json(deleteMember);
};

export const getAllGroupMessageMembers = async (req, res) => {
  const { groupMessageRoomId } = req.body;

  const groupMessageRoom = await GroupMessageRooms.getGroupMessageRoom(["message_room_id"], [groupMessageRoomId]);

  if (!groupMessageRoom) {
    throw new NotFoundError("This group message room does not exist.");
  }

  const allGroupMessageMembers = await GroupMessageMembers.getAllGroupMessageMembers(
    ["message_room_id"],
    [groupMessageRoomId]
  );

  if (!allGroupMessageMembers) {
    throw new BadRequestError("Error in getting all members in the group message.");
  }

  res.status(StatusCodes.OK).json(allGroupMessageMembers);
};

export const getGroupMessageMember = async (req, res) => {
  const { message_member_uuid } = req.params;

  const groupMessageMember = await GroupMessageMembers.getGroupMessageMember(
    ["message_member_uuid"],
    [message_member_uuid]
  );

  if (!groupMessageMember) {
    throw new NotFoundError("This group message member does not exist.");
  }

  res.status(StatusCodes.OK).json(groupMessageMember);
};
