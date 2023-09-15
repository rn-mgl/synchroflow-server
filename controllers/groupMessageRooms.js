import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../errors";
import { StatusCodes } from "http-status-codes";
import { GroupMessageRooms } from "../models/GroupMessageRooms";

export const createGroupMessageRoom = async (req, res) => {
  const { groupMessageName } = req.body;

  const groupMessageUUID = uuidv4();

  const groupMessageRoom = new GroupMessageRooms(groupMessageUUID, groupMessageName);

  const newGroupMessageRoom = await groupMessageRoom.createGroupMessageRoom();

  if (!newGroupMessageRoom) {
    throw new BadRequestError("Error in creating group message room. Try again later.");
  }

  res.status(StatusCodes.OK).json(newGroupMessageRoom);
};

export const deleteGroupMessageRoom = async (req, res) => {
  const { group_message_room } = req.params;

  const groupMessageRoom = await GroupMessageRooms.getGroupMessageRoom("group_message_room", group_message_room);

  if (!groupMessageRoom) {
    throw new NotFoundError("The group message room does not exist.");
  }

  const deleteRoom = await GroupMessageRooms.deleteGroupMessageRoom(
    "group_message_room_id",
    groupMessageRoom.group_message_room_id
  );

  if (!deleteRoom) {
    throw new BadRequestError("Error in deleting group message room. Try again later.");
  }

  res.status(StatusCodes.OK).json(deleteRoom);
};

export const getGroupMessageRoom = async (req, res) => {
  const { group_message_room } = req.params;

  const groupMessageRoom = await GroupMessageRooms.getGroupMessageRoom("group_message_room", group_message_room);

  if (!groupMessageRoom) {
    throw new NotFoundError("The group message room does not exist.");
  }

  res.status(StatusCodes.OK).json(groupMessageRoom);
};

export const getAllGroupMessageRoom = async (req, res) => {
  const { id } = req.body;

  const allGroupMessageRoom = await GroupMessageRooms.getAllGroupMessageRooms("member_id", id);

  if (!allGroupMessageRoom) {
    throw new NotFoundError("Error in getting all group message rooms.");
  }

  res.status(StatusCodes.OK).json(allGroupMessageRoom);
};
