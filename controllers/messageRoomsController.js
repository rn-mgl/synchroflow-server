import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { MessageRooms } from "../models/MessageRooms.js";
import { RoomMembers } from "../models/RoomMembers.js";
import { Users } from "../models/Users.js";

export const createMessageRoom = async (req, res) => {
  const { roomData } = req.body;
  const { roomName, roomImage } = roomData;
  const { id } = req.user;

  const messageUUID = uuidv4();

  const messageRoom = new MessageRooms(
    messageUUID,
    roomName,
    roomImage,
    "group",
    id,
  );

  const newMessageRoom = await messageRoom.createMessageRoom();

  if (!newMessageRoom) {
    throw new BadRequestError(
      "Error in creating message room. Try again later.",
    );
  }

  const roomMemberUUID = uuidv4();

  const newRoomMember = new RoomMembers(
    roomMemberUUID,
    id,
    newMessageRoom.insertId,
  );

  const createRoomMember = await newRoomMember.createRoomMember();

  if (!createRoomMember) {
    throw new BadRequestError("Error in adding you to the . Try again later.");
  }

  return res.status(StatusCodes.OK).json(newMessageRoom);
};

export const deleteMessageRoom = async (req, res) => {
  const { message_room } = req.params;
  const { roomType } = req.query;
  const { id } = req.user;

  const messageRoom = await MessageRooms.getMessageRoom(
    message_room,
    roomType,
    id,
  );

  if (!messageRoom) {
    throw new NotFoundError("The message room does not exist.");
  }

  const roomMembers = await RoomMembers.getAllRoomMembers(
    ["message_room_fk_id"],
    [messageRoom[0]?.message_room_id],
  );

  if (!roomMembers) {
    throw new BadRequestError("Error in getting message room members.");
  }

  const roomMembersUUID = roomMembers.map((roomMember) => roomMember.user_uuid);

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
    .json({ deletedRoom: deleteRoom, rooms: roomMembersUUID });
};

const updateMessageRoomName = async (req, res) => {
  const { message_room } = req.params;
  const { roomData, roomType } = req.body;
  const { roomName, roomImage } = roomData;
  const { id } = req.user;

  const messageRoom = await MessageRooms.getMessageRoom(
    message_room,
    roomType,
    id,
  );

  if (!messageRoom) {
    throw new NotFoundError("The message room does not exist.");
  }

  const updateRoomName = await MessageRooms.updateMessageName(
    roomName,
    roomImage,
    messageRoom[0]?.message_room_id,
  );

  if (!updateRoomName) {
    throw new BadRequestError(
      "Error in updating message room name. Try again later.",
    );
  }

  const roomMembers = await RoomMembers.getAllRoomMembers(
    ["room_fk_id"],
    [messageRoom[0]?.message_room_id],
  );

  if (!roomMembers) {
    throw new BadRequestError("Error in getting message room members.");
  }

  const roomMembersUUID = roomMembers.map((roomMember) => roomMember.user_uuid);

  res
    .status(StatusCodes.OK)
    .json({ updatedRoom: updateRoomName, rooms: roomMembersUUID });
};

const updateMessageOwner = async (req, res) => {
  const { message_room } = req.params;
  const { ownerUUID, roomType } = req.body;
  const { id } = req.user;

  const owner = await Users.getUser(["user_uuid"], [ownerUUID]);

  if (!owner) {
    throw new NotFoundError("This user does not exist.");
  }

  const messageRoom = await MessageRooms.getMessageRoom(
    message_room,
    roomType,
    id,
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

  return res.status(StatusCodes.OK).json({ success: !!updateMessage });
};

export const updateMessage = async (req, res) => {
  const { type } = req.body;

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
  const { roomType } = req.query;

  const allMessageRoom = await MessageRooms.getAllMessageRooms(id, roomType);

  if (!allMessageRoom) {
    throw new NotFoundError("Error in getting all message rooms.");
  }

  return res.status(StatusCodes.OK).json(allMessageRoom);
};

const getMessageRoomMainData = async (req, res) => {
  const { message_room } = req.params;
  const { roomType } = req.query;
  const { id } = req.user;

  const messageRoom = await MessageRooms.getMessageRoom(
    message_room,
    roomType,
    id,
  );

  if (!messageRoom) {
    throw new NotFoundError("The message room does not exist.");
  }

  return res.status(StatusCodes.OK).json(messageRoom[0]);
};

const getMessageRoomMessages = async (req, res) => {
  const { message_room } = req.params;
  const { roomType } = req.query;
  const { id } = req.user;

  const messageRoom = await MessageRooms.getMessageRoom(
    message_room,
    roomType,
    id,
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

  return res.status(StatusCodes.OK).json(messageRoomMessages);
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
