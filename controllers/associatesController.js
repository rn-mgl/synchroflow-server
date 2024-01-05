import { v4 as uuidv4 } from "uuid";
import { Associates } from "../models/Associates.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { Users } from "../models/Users.js";
import { PrivateMessageRooms } from "../models/PrivateMessageRooms.js";
import { PrivateMessageMembers } from "../models/PrivateMessageMembers.js";

const createMessageRoom = async (req, res, user) => {
  const { id } = req.user;
  const privateMessageRoomUUID = uuidv4();
  const myPrivateMessageMemberUUID = uuidv4();
  const associatePrivateMessageMemberUUID = uuidv4();

  const privateMessageRoom = new PrivateMessageRooms(privateMessageRoomUUID);

  const newPrivateMessageRoom = await privateMessageRoom.createPrivateMessageRoom();

  if (!newPrivateMessageRoom) {
    throw new BadRequestError("Error in establishing private room for messages. Try again later.");
  }

  const myPrivateMessageMember = new PrivateMessageMembers(
    myPrivateMessageMemberUUID,
    id,
    newPrivateMessageRoom.insertId
  );
  const associatePrivateMessageMember = new PrivateMessageMembers(
    associatePrivateMessageMemberUUID,
    user.user_id,
    newPrivateMessageRoom.insertId
  );

  const newMyPrivateMessageMember = myPrivateMessageMember.createPrivateMessageMember();

  if (!newMyPrivateMessageMember) {
    throw new BadRequestError("Error in entering private room for messages. Try again later.");
  }

  const newAssociatePrivateMessageMember = associatePrivateMessageMember.createPrivateMessageMember();

  if (!newAssociatePrivateMessageMember) {
    throw new BadRequestError("Error in entering private room for messages. Try again later.");
  }
};

export const createAssociate = async (req, res) => {
  const { userUUID } = req.body;
  const { id } = req.user;

  const user = await Users.getUser(["user_uuid"], [userUUID]);

  if (!user) {
    throw new NotFoundError("The user your are trying to associate with does not exist.");
  }

  const associateUUID = uuidv4();

  const associate = new Associates(associateUUID, id, user[0]?.user_id);
  const newAssociate = await associate.createAssociate();

  if (!newAssociate) {
    throw new BadRequestError("Error in establishing associate connection. Try again later.");
  }

  const memberCount = await PrivateMessageRooms.getPrivateMessageRoomExistingMembers(id, user.user_id);

  if (!memberCount[0] || memberCount[0]?.total_members !== 2) {
    await createMessageRoom(req, res, user);
  }

  res.status(StatusCodes.OK).json(newAssociate);
};

export const deleteAssociate = async (req, res) => {
  const { associate_uuid } = req.params;

  const associate = await Associates.getAssociate(["associate_uuid"], [associate_uuid]);

  if (!associate) {
    throw new NotFoundError("This associate connection no longer exist.");
  }

  const deleteConnection = await Associates.deleteAssociate(["associate_id"], [associate[0]?.associate_id]);

  if (!deleteConnection) {
    throw new NotFoundError("Error in deleting associate connection. Try again later.");
  }

  res.status(StatusCodes.OK).json(deleteConnection);
};

export const getAssociate = async (req, res) => {
  const { associate_uuid } = req.params;

  const associate = await Associates.getAssociate(["a.associate_uuid"], [associate_uuid]);

  if (!associate) {
    throw new NotFoundError("This associate connection no longer exist.");
  }

  res.status(StatusCodes.OK).json(associate[0]);
};

const getAllRecentAssociates = async (req, res) => {
  const { id } = req.user;
  const { sortFilter, searchFilter, searchCategory } = req.query;

  const associates = await Associates.getAllRecentAssociates(id, sortFilter, searchFilter, searchCategory);

  if (!associates) {
    throw new BadRequestError("Error in getting your associates. Try again later.");
  }

  res.status(StatusCodes.OK).json(associates);
};

const getAllMyAssociates = async (req, res) => {
  const { id } = req.user;
  const { sortFilter, searchFilter, searchCategory } = req.query;

  const associates = await Associates.getAllAssociates(id, sortFilter, searchFilter, searchCategory);

  if (!associates) {
    throw new BadRequestError("Error in getting your associates. Try again later.");
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
