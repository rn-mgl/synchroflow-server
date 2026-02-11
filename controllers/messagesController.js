import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { Messages } from "../models/Messages.js";
import { MessageRooms } from "../models/MessageRooms.js";
import { RoomMembers } from "../models/RoomMembers.js";

export const createMessage = async (req, res) => {
  const { messageRoom, message, messageFile, messageFileType, roomType } =
    req.body;
  const { id } = req.user;

  const messageUUID = uuidv4();

  const room = await MessageRooms.getMessageRoom(messageRoom, roomType, id);

  if (!room || !room[0]) {
    throw new NotFoundError(`This group does not exist.`);
  }

  const messageInstance = new Messages(
    room[0].message_room_id,
    messageUUID,
    id,
    message,
    messageFile,
    messageFileType,
  );

  const newMessage = await messageInstance.createMessage();

  if (!newMessage) {
    throw new BadRequestError(
      "Error in sending group message. Try again later.",
    );
  }

  const messageMembers = await RoomMembers.getAllRoomMembers(
    ["room_fk_id"],
    [room[0]?.message_room_id],
  );

  if (!messageMembers) {
    throw new BadRequestError("Error in getting group message members.");
  }

  const messageMembersUUID = messageMembers.map(
    (messageMember) => messageMember.user_uuid,
  );

  res
    .status(StatusCodes.OK)
    .json({ message: newMessage, rooms: messageMembersUUID });
};

export const deleteMessage = async (req, res) => {
  const { message_uuid } = req.params;

  const message = await Messages.getMessage(["message_uuid"], [message_uuid]);

  if (!message) {
    throw new NotFoundError("This message does not exist.");
  }

  const deleteMessage = await Messages.deleteMessage(
    ["message_id"],
    [message[0]?.message_id],
  );

  if (!deleteMessage) {
    throw new BadRequestError(
      "Error in deleting group message. Try again later.",
    );
  }

  return res.status(StatusCodes.OK).json(deleteMessage);
};

export const getMessage = async (req, res) => {
  const { message_uuid } = req.params;

  const message = await Messages.getMessage(["message_uuid"], [message_uuid]);

  if (!message) {
    throw new NotFoundError("This message does not exist.");
  }

  return res.status(StatusCodes.OK).json(message[0]);
};

const getMessages = async (req, res) => {
  const { messageRoom } = req.query;

  const messages = await Messages.getAllMessages(
    ["message_room"],
    [messageRoom],
  );

  if (!messages) {
    throw new BadRequestError(
      "Error in getting Group messages. Try again later.",
    );
  }
  return res.status(StatusCodes.OK).json(messages);
};

const getLatestMessages = async (req, res) => {
  const { messageRoom, roomType } = req.query;
  const { id } = req.user;

  const room = await MessageRooms.getMessageRoom(messageRoom, roomType, id);

  if (!room) {
    throw new NotFoundError("This group message room does not exist.");
  }

  const latestMessage = await Messages.getLatestMessage(
    room[0]?.message_room_id,
  );

  if (!latestMessage) {
    throw new BadRequestError("Error in getting the latest message.");
  }

  return res.status(StatusCodes.OK).json(latestMessage[0]);
};

export const getAllMessages = async (req, res) => {
  const { type } = req.query;

  if (type === "all") {
    await getMessages(req, res);
    return;
  }

  if (type === "latest") {
    await getLatestMessages(req, res);
    return;
  }
};
