import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { GroupMessageRooms } from "../models/GroupMessageRooms.js";
import { GroupMessageMembers } from "../models/GroupMessageMembers.js";

export const createGroupMessageRoom = async (req, res) => {
  const { groupMessageData } = req.body;
  const { groupMessageName, groupImage } = groupMessageData;
  const { id } = req.user;

  const groupMessageUUID = uuidv4();

  const groupMessageRoom = new GroupMessageRooms(groupMessageUUID, groupMessageName, groupImage);

  const newGroupMessageRoom = await groupMessageRoom.createGroupMessageRoom();

  if (!newGroupMessageRoom) {
    throw new BadRequestError("Error in creating group message room. Try again later.");
  }

  const groupMessageMemberUUID = uuidv4();

  const newGroupMessageMember = new GroupMessageMembers(groupMessageMemberUUID, id, newGroupMessageRoom.insertId);

  const createGroupMessageMember = await newGroupMessageMember.createGroupMessageMember();

  if (!createGroupMessageMember) {
    throw new BadRequestError("Error in adding you to the group. Try again later.");
  }

  res.status(StatusCodes.OK).json(newGroupMessageRoom);
};

export const deleteGroupMessageRoom = async (req, res) => {
  const { message_room } = req.params;

  const groupMessageRoom = await GroupMessageRooms.getGroupMessageRoom(["message_room"], [message_room]);

  if (!groupMessageRoom) {
    throw new NotFoundError("The group message room does not exist.");
  }

  const deleteRoom = await GroupMessageRooms.deleteGroupMessageRoom(
    ["message_room_id"],
    [groupMessageRoom.message_room_id]
  );

  if (!deleteRoom) {
    throw new BadRequestError("Error in deleting group message room. Try again later.");
  }

  res.status(StatusCodes.OK).json(deleteRoom);
};

export const updateGroupMessageRoomName = async (req, res) => {
  const { message_room } = req.params;
  const { groupMessageRoomName } = req.body;

  const groupMessageRoom = await GroupMessageRooms.getGroupMessageRoom(["message_room"], [message_room]);

  if (!groupMessageRoom) {
    throw new NotFoundError("The group message room does not exist.");
  }

  const updateRoomName = await GroupMessageRooms.updateGroupMessageName(
    [groupMessageRoomName],
    ["message_room_id"],
    [groupMessageRoom.message_room_id]
  );

  if (!updateRoomName) {
    throw new BadRequestError("Error in updating group message room name. Try again later.");
  }

  res.status(StatusCodes.OK).json(updateRoomName);
};

export const getGroupMessageRoom = async (req, res) => {
  const { message_room } = req.params;

  const groupMessageRoom = await GroupMessageRooms.getGroupMessageRoom(["message_room"], [message_room]);

  if (!groupMessageRoom) {
    throw new NotFoundError("The group message room does not exist.");
  }

  res.status(StatusCodes.OK).json(groupMessageRoom);
};

export const getAllGroupMessageRoom = async (req, res) => {
  const { id } = req.user;

  const allGroupMessageRoom = await GroupMessageRooms.getAllGroupMessageRooms(id);

  if (!allGroupMessageRoom) {
    throw new NotFoundError("Error in getting all group message rooms.");
  }

  res.status(StatusCodes.OK).json(allGroupMessageRoom);
};
