import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { GroupMessages } from "../models/GroupMessages.js";

export const createGroupMessage = async (req, res) => {
  const { roomId, message, messageFile, messageFileType } = req.body;
  const { id } = req.user;

  const groupMessageUUID = uuidv4();

  const groupMessage = new GroupMessages(roomId, groupMessageUUID, id, message, messageFile, messageFileType);

  const newGroupMessage = await groupMessage.createGroupMessage();

  if (!newGroupMessage) {
    throw new BadRequestError("Error in sending group message. Try again later.");
  }

  res.status(StatusCodes.OK).json(newGroupMessage);
};

export const deleteGroupMessage = async (req, res) => {
  const { message_uuid } = req.params;

  const groupMessage = await GroupMessages.getGroupMessage(["message_uuid"], [message_uuid]);

  if (!groupMessage) {
    throw new NotFoundError("This message does not exist.");
  }

  const deleteMessage = await GroupMessages.deleteGroupMessage(["message_id"], [groupMessage.message_id]);

  if (!deleteMessage) {
    throw new BadRequestError("Error in deleting group message. Try again later.");
  }

  res.status(StatusCodes.OK).json(deleteMessage);
};

export const getGroupMessage = async (req, res) => {
  const { message_uuid } = req.params;

  const groupMessage = await GroupMessages.getGroupMessage(["message_uuid"], [message_uuid]);

  if (!groupMessage) {
    throw new NotFoundError("This message does not exist.");
  }

  res.status(StatusCodes.OK).json(groupMessage);
};

export const getAllGroupMessages = async (req, res) => {
  const { roomId } = req.query;

  const allGroupMessages = await GroupMessages.getAllGroupMessages(["gm.message_room_id"], [roomId]);

  if (!allGroupMessages) {
    throw new BadRequestError("Error in getting all group messages. Try again later.");
  }

  res.status(StatusCodes.OK).json(allGroupMessages);
};
