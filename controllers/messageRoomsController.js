import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { MessageRooms } from "../models/MessageRooms.js";
import { RoomMembers } from "../models/RoomMembers.js";
import { Users } from "../models/Users.js";

export const createMessageRoom = async (req, res) => {
  const { messageData } = req.body;
  const { roomName, roomImage } = messageData;
  const { id } = req.user;

  const messageUUID = uuidv4();

  const messageRoom = new MessageRooms(messageUUID, roomName, roomImage, id);

  const newMessageRoom = await messageRoom.createMessageRoom();

  if (!newMessageRoom) {
    throw new BadRequestError(
      "Error in creating message room. Try again later.",
    );
  }

  const messageMemberUUID = uuidv4();

  const newMessageMember = new RoomMembers(
    messageMemberUUID,
    id,
    newMessageRoom.insertId,
  );

  const createMessageMember = await newMessageMember.createMessageMember();

  if (!createMessageMember) {
    throw new BadRequestError("Error in adding you to the . Try again later.");
  }

  res.status(StatusCodes.OK).json(newMessageRoom);
};

export const deleteMessageRoom = async (req, res) => {
  const { message_room } = req.params;

  const messageRoom = await MessageRooms.getMessageRoom(
    ["message_room"],
    [message_room],
  );

  if (!messageRoom) {
    throw new NotFoundError("The message room does not exist.");
  }

  const messageMembers = await RoomMembers.getAllMessageMembers(
    ["message_room_fk_id"],
    [messageRoom[0]?.message_room_id],
  );

  if (!messageMembers) {
    throw new BadRequestError("Error in getting message room members.");
  }

  const messageMembersUUID = messageMembers.map(
    (messageMember) => messageMember.user_uuid,
  );

  const deleteRoom = await MessageRooms.deleteMessageRoom(
    ["message_room_id"],
    [messageRoom[0]?.message_room_id],
  );

  if (!deleteRoom) {
    throw new BadRequestError(
      "Error in deleting message room. Try again later.",
    );
  }

  res
    .status(StatusCodes.OK)
    .json({ deletedRoom: deleteRoom, rooms: messageMembersUUID });
};

const updateMessageRoomName = async (req, res) => {
  const { message_room } = req.params;
  const { messageData } = req.body;
  const { messageName, Image } = messageData;

  const messageRoom = await MessageRooms.getMessageRoom(
    ["message_room"],
    [message_room],
  );

  if (!messageRoom) {
    throw new NotFoundError("The message room does not exist.");
  }

  const updateRoomName = await MessageRooms.updateMessageName(
    messageName,
    Image,
    messageRoom[0]?.message_room_id,
  );

  if (!updateRoomName) {
    throw new BadRequestError(
      "Error in updating message room name. Try again later.",
    );
  }

  const messageMembers = await RoomMembers.getAllMessageMembers(
    ["message_room_fk_id"],
    [messageRoom[0]?.message_room_id],
  );

  if (!messageMembers) {
    throw new BadRequestError("Error in getting message room members.");
  }

  const messageMembersUUID = messageMembers.map(
    (messageMember) => messageMember.user_uuid,
  );

  res
    .status(StatusCodes.OK)
    .json({ updatedRoom: updateRoomName, rooms: messageMembersUUID });
};

const updateMessageOwner = async (req, res) => {
  const { message_room } = req.params;
  const { ownerUUID } = req.body;

  const owner = await Users.getUser(["user_uuid"], [ownerUUID]);

  if (!owner) {
    throw new NotFoundError("This user does not exist.");
  }

  const messageRoom = await MessageRooms.getMessageRoom(
    ["message_room"],
    [message_room],
  );

  if (!messageRoom) {
    throw new NotFoundError("The message room does not exist.");
  }

  const updateMessage = await MessageRooms.updateMessageCreator(
    messageRoom[0]?.message_room_id,
    owner[0]?.user_id,
  );

  if (!updateMessage) {
    throw new BadRequestError("Error in updating owner. Try again later.");
  }

  res.status(StatusCodes.OK).json(updateMessage);
};

export const updateMessage = async (req, res) => {
  const { type } = req.query;

  if (type === "name") {
    await updateMessageRoomName(req, res);
    return;
  }

  if (type === "owner") {
    await updateMessageOwner(req, res);
    return;
  }
};

export const getAllMessageRoom = async (req, res) => {
  const { id } = req.user;
  const { searchFilter } = req.query;

  const allMessageRoom = await MessageRooms.getAllMessageRooms(
    id,
    searchFilter,
  );

  if (!allMessageRoom) {
    throw new NotFoundError("Error in getting all message rooms.");
  }

  res.status(StatusCodes.OK).json(allMessageRoom);
};

const getMessageRoomMainData = async (req, res) => {
  const { message_room } = req.params;

  const messageRoom = await MessageRooms.getMessageRoom(
    ["message_room"],
    [message_room],
  );

  if (!messageRoom) {
    throw new NotFoundError("The message room does not exist.");
  }

  res.status(StatusCodes.OK).json(messageRoom[0]);
};

const getMessageRoomMessages = async (req, res) => {
  const { message_room } = req.params;

  const messageRoom = await MessageRooms.getMessageRoom(
    ["message_room"],
    [message_room],
  );

  if (!messageRoom) {
    throw new NotFoundError("This room does not exist.");
  }

  const messageRoomMessages = await MessageRooms.getMessageRoomMessages(
    ["message_room"],
    [message_room],
  );

  if (!messageRoomMessages) {
    throw new NotFoundError("Error in getting messages.");
  }

  res.status(StatusCodes.OK).json(messageRoomMessages);
};

export const getMessageRoom = async (req, res) => {
  const { type } = req.query;

  if (type === "messages") {
    await getMessageRoomMessages(req, res);
    return;
  }

  if (type === "main") {
    await getMessageRoomMainData(req, res);
    return;
  }
};
