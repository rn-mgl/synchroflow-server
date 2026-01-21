import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { PrivateMessageRooms } from "../models/PrivateMessageRooms.js";

export const createPrivateMessageRoom = async (req, res) => {
  const privateMessageRoomUUID = uuidv4();

  const privateMessageRoom = new PrivateMessageRooms(privateMessageRoomUUID);

  const newPrivateMessageRoom =
    await privateMessageRoom.createPrivateMessageRoom();

  if (!newPrivateMessageRoom) {
    throw new BadRequestError("Error in creating room. Try again later.");
  }

  res.status(StatusCodes.OK).json(newPrivateMessageRoom);
};

export const deletePrivateMessageRoom = async (req, res) => {
  const { message_room } = req.params;

  const privateMessageRoom =
    await PrivateMessageRooms.getPrivateMessageRoomMessages(
      ["message_room"],
      [message_room],
    );

  if (!privateMessageRoom) {
    throw new NotFoundError("This room does not exist.");
  }

  const deleteRoom = await PrivateMessageRooms.deletePrivateMessageRoom(
    ["message_room_id"],
    [privateMessageRoom.message_room_id],
  );

  if (!deleteRoom) {
    throw new BadRequestError("Error in deleting room. Try again later.");
  }

  res.status(StatusCodes.OK).json(deleteRoom);
};

export const getAllPrivateMessageRooms = async (req, res) => {
  const { id } = req.user;
  const { searchFilter } = req.query;

  const privateMessageRooms =
    await PrivateMessageRooms.getAllPrivateMessageRooms(id, searchFilter);

  if (!privateMessageRooms) {
    throw new NotFoundError("This room does not exist.");
  }

  res.status(StatusCodes.OK).json(privateMessageRooms);
};

const getPrivateMessageRoomMainData = async (req, res) => {
  const { message_room } = req.params;
  const { id } = req.user;

  const privateMessageRoom =
    await PrivateMessageRooms.getPrivateMessageRoomMainData(id, message_room);

  if (!privateMessageRoom) {
    throw new NotFoundError("This room does not exist.");
  }

  res.status(StatusCodes.OK).json(privateMessageRoom[0]);
};

const getPrivateMessageRoomMessages = async (req, res) => {
  const { message_room } = req.params;
  const { limit } = req.query;

  const privateMessageRoom = await PrivateMessageRooms.getPrivateMessageRoom(
    ["message_room"],
    [message_room],
  );

  if (!privateMessageRoom) {
    throw new NotFoundError("This room does not exist.");
  }

  const privateMessageRoomMessages =
    await PrivateMessageRooms.getPrivateMessageRoomMessages(
      ["message_room"],
      [message_room],
      limit ?? 20,
    );

  if (!privateMessageRoomMessages) {
    throw new NotFoundError("Error in getting messages.");
  }

  res.status(StatusCodes.OK).json(privateMessageRoomMessages);
};

export const getPrivateMessageRoom = async (req, res) => {
  const { type } = req.query;

  if (type === "messages") {
    await getPrivateMessageRoomMessages(req, res);
    return;
  }

  if (type === "main") {
    await getPrivateMessageRoomMainData(req, res);
    return;
  }
};
