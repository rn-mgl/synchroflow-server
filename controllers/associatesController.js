import { v4 as uuidv4 } from "uuid";
import { Associates } from "../models/Associates.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { Users } from "../models/Users.js";
import { RoomMembers } from "../models/RoomMembers.js";
import { MessageRooms } from "../models/MessageRooms.js";

// privates

const createMessageRoom = async (userId, associateId) => {
  const messageRoomUUID = uuidv4();
  const myRoomMemberUUID = uuidv4();
  const associateRoomMemberUUID = uuidv4();

  const roomName = null;
  const roomImage = null;

  const messageRoom = new MessageRooms(
    messageRoomUUID,
    roomName,
    roomImage,
    "private",
    associateId,
  );

  const newMessageRoom = await messageRoom.createMessageRoom();

  if (!newMessageRoom) {
    throw new BadRequestError(
      "Error in establishing private room for messages. Try again later.",
    );
  }

  const myRoomMember = new RoomMembers(
    myRoomMemberUUID,
    userId,
    newMessageRoom.insertId,
  );

  const associateRoomMember = new RoomMembers(
    associateRoomMemberUUID,
    associateId,
    newMessageRoom.insertId,
  );

  const newMyRoomMember = await myRoomMember.createRoomMember();

  if (!newMyRoomMember) {
    throw new BadRequestError(
      "Error in entering private room for messages. Try again later.",
    );
  }

  const newAssociateRoomMember = await associateRoomMember.createRoomMember();

  if (!newAssociateRoomMember) {
    throw new BadRequestError(
      "Error in entering private room for messages. Try again later.",
    );
  }
};

const getAllMyAssociates = async (req, res) => {
  const { id } = req.user;
  const { sortFilter, searchFilter, searchCategory } = req.query;

  const associates = await Associates.getAllAssociates(
    id,
    sortFilter,
    searchFilter,
    searchCategory,
  );

  if (!associates) {
    throw new BadRequestError(
      "Error in getting your associates. Try again later.",
    );
  }

  res.status(StatusCodes.OK).json(associates);
};

// exports

export const createAssociate = async (req, res) => {
  const { userUUID } = req.body;
  const { id } = req.user;

  const user = await Users.getUser(["user_uuid"], [userUUID]);

  if (!user || !user[0]) {
    throw new NotFoundError(
      "The user your are trying to associate with does not exist.",
    );
  }

  const associateUUID = uuidv4();

  const associate = new Associates(associateUUID, id, user[0]?.user_id);
  const newAssociate = await associate.createAssociate();

  if (!newAssociate) {
    throw new BadRequestError(
      "Error in establishing associate connection. Try again later.",
    );
  }

  const memberCount = await MessageRooms.getPrivateRoomByMembers(
    id,
    user[0].user_id,
  );

  if (!memberCount[0] || memberCount[0]?.total_members !== 2) {
    await createMessageRoom(id, user[0].user_id);
  }

  res.status(StatusCodes.OK).json(newAssociate);
};

export const deleteAssociate = async (req, res) => {
  const { associate_uuid } = req.params;

  const associate = await Associates.getAssociate(
    ["associate_uuid"],
    [associate_uuid],
  );

  if (!associate) {
    throw new NotFoundError("This associate connection no longer exist.");
  }

  const deleteConnection = await Associates.deleteAssociate(
    ["associate_id"],
    [associate[0]?.associate_id],
  );

  if (!deleteConnection) {
    throw new NotFoundError(
      "Error in deleting associate connection. Try again later.",
    );
  }

  res.status(StatusCodes.OK).json(deleteConnection);
};

export const getAssociate = async (req, res) => {
  const { associate_uuid } = req.params;

  const associate = await Associates.getAssociate(
    ["a.associate_uuid"],
    [associate_uuid],
  );

  if (!associate) {
    throw new NotFoundError("This associate connection no longer exist.");
  }

  res.status(StatusCodes.OK).json(associate[0]);
};

const getAllRecentAssociates = async (req, res) => {
  const { id } = req.user;
  const { sortFilter, searchFilter, searchCategory } = req.query;

  const associates = await Associates.getAllRecentAssociates(
    id,
    sortFilter,
    searchFilter,
    searchCategory,
  );

  if (!associates) {
    throw new BadRequestError(
      "Error in getting your associates. Try again later.",
    );
  }

  res.status(StatusCodes.OK).json(associates);
};

export const getAllAssociates = async (req, res) => {
  const { type } = req.query;

  if (type === "all") {
    await getAllMyAssociates(req, res);
    return;
  }

  if (type === "recent") {
    await getAllRecentAssociates(req, res);
    return;
  }
};
