import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { PrivateMessageRooms } from "../models/PrivateMessageRooms.js";

export const createPrivateMessageRoom = async (req, res) => {
  const privateMessageRoomUUID = uuidv4();

  const privateMessageRoom = new PrivateMessageRooms(privateMessageRoomUUID);

  const newPrivateMessageRoom = await privateMessageRoom.createPrivateMessageRoom();

  if (!newPrivateMessageRoom) {
    throw new BadRequestError("Error in creating room. Try again later.");
  }

  res.status(StatusCodes.OK).json(newPrivateMessageRoom);
};

export const deletePrivateMessageRoom = async (req, res) => {
  const { private_message_room } = req.params;

  const privateMessageRoom = await PrivateMessageRooms.getPrivateMessageRoom(
    ["private_message_room"],
    [private_message_room]
  );

  if (!privateMessageRoom) {
    throw new NotFoundError("This room does not exist.");
  }

  const deleteRoom = await PrivateMessageRooms.deletePrivateMessageRoom(
    ["private_message_room_id"],
    [privateMessageRoom.private_message_room_id]
  );

  if (!deleteRoom) {
    throw new BadRequestError("Error in deleting room. Try again later.");
  }

  res.status(StatusCodes.OK).json(deleteRoom);
};

export const getAllPrivateMessageRooms = async (req, res) => {
  const { id } = req.user;

  const privateMessageRooms = await PrivateMessageRooms.getAllPrivateMessageRooms(id);

  if (!privateMessageRooms) {
    throw new NotFoundError("This room does not exist.");
  }

  res.status(StatusCodes.OK).json(privateMessageRooms);
};

export const getPrivateMessageRoom = async (req, res) => {
  const { private_message_room } = req.params;

  const privateMessageRoom = await PrivateMessageRooms.getPrivateMessageRoom(
    ["private_message_room"],
    [private_message_room]
  );

  if (!privateMessageRoom) {
    throw new NotFoundError("This room does not exist.");
  }

  res.status(StatusCodes.OK).json(privateMessageRoom);
};
