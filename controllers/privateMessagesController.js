import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../errors";
import { StatusCodes } from "http-status-codes";
import { PrivateMessages } from "../models/PrivateMessages";

export const createPrivateMessage = async (req, res) => {
  const { roomId, messageTo, message, messageFile } = req.body;
  const { id } = req.user;
  const privateMessageUUID = uuidv4();

  const privateMessage = new PrivateMessages(privateMessageUUID, roomId, id, messageTo, message, messageFile);

  const newPrivateMessage = await privateMessage.createPrivateMessage();

  if (!newPrivateMessage) {
    throw new BadRequestError("Error in sending message. Try again later.");
  }

  res.status(StatusCodes.OK).json(newPrivateMessage);
};

export const deletePrivateMessage = async (req, res) => {
  const { private_message_uuid } = req.params;

  const privateMessage = await PrivateMessages.getPrivateMessage("private_message_uuid", private_message_uuid);

  if (!privateMessage) {
    throw new NotFoundError("This private message does not exist.");
  }

  const deleteMessage = await PrivateMessages.deletePrivateMessage(
    "private_message_id",
    privateMessage.private_message_id
  );

  if (!deleteMessage) {
    throw new BadRequestError("Error in deleting private message. Try again later.");
  }

  res.status(StatusCodes.OK).json(deleteMessage);
};

export const getAllPrivateMessages = async (req, res) => {
  const { roomId } = req.body;

  const privateMessages = await PrivateMessages.getAllPrivateMessages("private_message_room_id ", roomId);

  if (!privateMessages) {
    throw new BadRequestError("Error in getting private messages. Try again later.");
  }
  res.status(StatusCodes.OK).json(privateMessages);
};
