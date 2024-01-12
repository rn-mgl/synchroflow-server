import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { GroupMessages } from "../models/GroupMessages.js";
import { GroupMessageRooms } from "../models/GroupMessageRooms.js";
import { GroupMessageMembers } from "../models/GroupMessageMembers.js";

export const createGroupMessage = async (req, res) => {
  const { messageRoom, message, messageFile, messageFileType } = req.body;
  const { id, uuid } = req.user;

  const groupMessageUUID = uuidv4();

  const groupMessageRoom = await GroupMessageRooms.getGroupMessageRoom(["message_room"], [messageRoom]);

  if (!groupMessageRoom) {
    throw new NotFoundError(`This group does not exist.`);
  }

  const groupMessage = new GroupMessages(
    groupMessageRoom[0]?.message_room_id,
    groupMessageUUID,
    id,
    message,
    messageFile,
    messageFileType
  );

  const newGroupMessage = await groupMessage.createGroupMessage();

  if (!newGroupMessage) {
    throw new BadRequestError("Error in sending group message. Try again later.");
  }

  const groupMessageMembers = await GroupMessageMembers.getAllGroupMessageMembers(
    ["message_room_fk_id"],
    [groupMessageRoom[0]?.message_room_id]
  );

  if (!groupMessageMembers) {
    throw new BadRequestError("Error in getting group message members.");
  }

  const groupMessageMembersUUID = groupMessageMembers.map((groupMessageMember) => groupMessageMember.user_uuid);

  res.status(StatusCodes.OK).json({ message: newGroupMessage, rooms: groupMessageMembersUUID });
};

export const deleteGroupMessage = async (req, res) => {
  const { message_uuid } = req.params;

  const groupMessage = await GroupMessages.getGroupMessage(["message_uuid"], [message_uuid]);

  if (!groupMessage) {
    throw new NotFoundError("This message does not exist.");
  }

  const deleteMessage = await GroupMessages.deleteGroupMessage(["message_id"], [groupMessage[0]?.message_id]);

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

  res.status(StatusCodes.OK).json(groupMessage[0]);
};

const getGroupMessages = async (req, res) => {
  const { messageRoom } = req.query;

  const groupMessages = await GroupMessages.getAllGroupMessages(["message_room"], [messageRoom]);

  if (!groupMessages) {
    throw new BadRequestError("Error in getting Group messages. Try again later.");
  }
  res.status(StatusCodes.OK).json(groupMessages);
};

const getLatestGroupMessages = async (req, res) => {
  const { messageRoom } = req.query;

  const groupMessageRoom = await GroupMessageRooms.getGroupMessageRoom(["message_room"], [messageRoom]);

  if (!groupMessageRoom) {
    throw new NotFoundError("This group message room does not exist.");
  }

  const latestGroupMessage = await GroupMessages.getLatestGroupMessage(groupMessageRoom[0]?.message_room_id);

  if (!latestGroupMessage) {
    throw new BadRequestError("Error in getting the latest message.");
  }

  res.status(StatusCodes.OK).json(latestGroupMessage[0]);
};

export const getAllGroupMessages = async (req, res) => {
  const { type } = req.query;

  if (type === "all") {
    await getGroupMessages(req, res);
    return;
  }

  if (type === "latest") {
    await getLatestGroupMessages(req, res);
    return;
  }
};
