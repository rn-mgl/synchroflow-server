import { v4 as uuidv4 } from "uuid";
import { GroupMessageMembers } from "../models/GroupMessageMembers.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { GroupMessageRooms } from "../models/GroupMessageRooms.js";
import { Users } from "../models/Users.js";

export const createGroupMessageMember = async (req, res) => {
  const { memberUUID, groupRoomUUID } = req.body;
  const groupMessageMemberUUID = uuidv4();

  const groupMessageRoom = await GroupMessageRooms.getGroupMessageRoom(["message_room"], [groupRoomUUID]);

  if (!groupMessageRoom) {
    throw new NotFoundError(`This room does not exist.`);
  }

  const member = await Users.getUser(["user_uuid"], [memberUUID]);

  if (!member) {
    throw new NotFoundError(`This user does not exist.`);
  }

  const groupMessageMember = new GroupMessageMembers(
    groupMessageMemberUUID,
    member[0]?.user_id,
    groupMessageRoom[0]?.message_room_id
  );

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
    [groupMessageMember[0]?.message_member_id]
  );

  if (!deleteMember) {
    throw new BadRequestError("Error in deleting user in the group message.");
  }

  res.status(StatusCodes.OK).json(deleteMember);
};

const getGroupMessageMembers = async (req, res) => {
  const { messageRoom } = req.query;

  const groupMessageRoom = await GroupMessageRooms.getGroupMessageRoom(["message_room"], [messageRoom]);

  if (!groupMessageRoom) {
    throw new NotFoundError("This group message room does not exist.");
  }

  const allGroupMessageMembers = await GroupMessageMembers.getAllGroupMessageMembers(
    ["message_room_id"],
    [groupMessageRoom[0]?.message_room_id]
  );

  if (!allGroupMessageMembers) {
    throw new BadRequestError("Error in getting all members in the group message.");
  }

  res.status(StatusCodes.OK).json(allGroupMessageMembers);
};

const getPossibleGroupMessageMembers = async (req, res) => {
  const { messageRoom } = req.query;
  const { id } = req.user;

  const groupMessageRoom = await GroupMessageRooms.getGroupMessageRoom(["message_room"], [messageRoom]);

  if (!groupMessageRoom) {
    throw new NotFoundError("This group message room does not exist.");
  }

  const allGroupMessageMembers = await GroupMessageMembers.getPossibleGroupMembers(
    groupMessageRoom[0]?.message_room_id,
    id
  );

  if (!allGroupMessageMembers) {
    throw new BadRequestError("Error in getting all members in the group message.");
  }

  res.status(StatusCodes.OK).json(allGroupMessageMembers);
};

export const getAllGroupMessageMembers = async (req, res) => {
  const { type } = req.query;

  if (type === "all members") {
    await getGroupMessageMembers(req, res);
    return;
  }

  if (type === "possible members") {
    await getPossibleGroupMessageMembers(req, res);
    return;
  }
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

  res.status(StatusCodes.OK).json(groupMessageMember[0]);
};
