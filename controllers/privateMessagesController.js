import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { PrivateMessages } from "../models/PrivateMessages.js";
import { PrivateMessageRooms } from "../models/PrivateMessageRooms.js";
import { Users } from "../models/Users.js";

export const createPrivateMessage = async (req, res) => {
  const { messageRoom, messageToUUID, message, messageFile, messageFileType } =
    req.body;
  const { id, uuid } = req.user;
  const privateMessageUUID = uuidv4();

  const privateMessageRoom = await PrivateMessageRooms.getPrivateMessageRoom(
    ["message_room"],
    [messageRoom],
  );

  if (!privateMessageRoom) {
    throw new NotFoundError(
      `The room you are trying to access does not exist.`,
    );
  }

  const privateMessage = new PrivateMessages(
    privateMessageUUID,
    privateMessageRoom[0]?.message_room_id,
    id,
    message,
    messageFile,
    messageFileType,
  );

  const newPrivateMessage = await privateMessage.createPrivateMessage();

  if (!newPrivateMessage) {
    throw new BadRequestError("Error in sending message. Try again later.");
  }

  res
    .status(StatusCodes.OK)
    .json({ message: !!newPrivateMessage, rooms: [messageToUUID] });
};

export const deletePrivateMessage = async (req, res) => {
  const { message_uuid } = req.params;

  const privateMessage = await PrivateMessages.getPrivateMessage(
    ["message_uuid"],
    [message_uuid],
  );

  if (!privateMessage) {
    throw new NotFoundError("This private message does not exist.");
  }

  const deleteMessage = await PrivateMessages.deletePrivateMessage(
    ["message_id"],
    [privateMessage[0]?.message_id],
  );

  if (!deleteMessage) {
    throw new BadRequestError(
      "Error in deleting private message. Try again later.",
    );
  }

  res.status(StatusCodes.OK).json(deleteMessage);
};

const getPrivateMessages = async (req, res) => {
  const { roomId } = req.body;

  const privateMessages = await PrivateMessages.getAllPrivateMessages(
    ["message_room_id"],
    [roomId],
  );

  if (!privateMessages) {
    throw new BadRequestError(
      "Error in getting private messages. Try again later.",
    );
  }
  res.status(StatusCodes.OK).json(privateMessages);
};

const getLatestPrivateMessages = async (req, res) => {
  const { messageRoom } = req.query;

  const privateMessageRoom = await PrivateMessageRooms.getPrivateMessageRoom(
    ["message_room"],
    [messageRoom],
  );

  if (!privateMessageRoom) {
    throw new NotFoundError("This private message room does not exist.");
  }

  const latestPrivateMessage = await PrivateMessages.getLatestPrivateMessage(
    privateMessageRoom[0]?.message_room_id,
  );

  if (!latestPrivateMessage) {
    throw new BadRequestError("Error in getting the latest message.");
  }

  res.status(StatusCodes.OK).json(latestPrivateMessage[0]);
};

export const getAllPrivateMessages = async (req, res) => {
  const { type } = req.query;

  if (type === "all") {
    await getPrivateMessages(req, res);
    return;
  }

  if (type === "latest") {
    await getLatestPrivateMessages(req, res);
    return;
  }
};
