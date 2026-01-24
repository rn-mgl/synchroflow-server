import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/index.js";
import { MessageRooms } from "../models/MessageRooms.js";
import { RoomMembers } from "../models/RoomMembers.js";
import { Users } from "../models/Users.js";

export const createRoomMember = async (req, res) => {
  const { memberUUID, roomUUID, roomType } = req.body;
  const roomMemberUUID = uuidv4();
  const { id } = req.user;

  const messageRoom = await MessageRooms.getMessageRoom(roomUUID, roomType, id);

  if (!messageRoom) {
    throw new NotFoundError(`This room does not exist.`);
  }

  const member = await Users.getUser(["user_uuid"], [memberUUID]);

  if (!member) {
    throw new NotFoundError(`This user does not exist.`);
  }

  const roomMember = new RoomMembers(
    roomMemberUUID,
    member[0]?.user_id,
    messageRoom[0]?.message_room_id,
  );

  const newRoomMember = await roomMember.createRoomMember();

  if (!newRoomMember) {
    throw new BadRequestError("Error in adding user in the message.");
  }

  res.status(StatusCodes.OK).json(newRoomMember);
};

export const deleteRoomMember = async (req, res) => {
  const { identifier } = req.params;
  const { action, messageRoom, roomType } = req.query;
  const { id } = req.user;

  let roomMember = null;
  let deleteMember = null;

  switch (action) {
    case "remove":
      roomMember = await RoomMembers.getRoomMember(
        ["member_uuid"],
        [identifier],
      );

      if (!roomMember) {
        throw new NotFoundError("This room member does not exist.");
      }

      deleteMember = await RoomMembers.deleteRoomMember(
        ["member_id"],
        [roomMember[0]?.member_id],
      );

      if (!deleteMember) {
        throw new BadRequestError("Error in deleting user in the message.");
      }

      return res.status(StatusCodes.OK).json({ success: !!deleteMember });

    case "leave":
      if (id !== parseInt(identifier)) {
        throw new UnauthorizedError("This action is not allowed.");
      }

      const room = await MessageRooms.getMessageRoom(messageRoom, roomType, id);

      if (!room || !room[0]) {
        throw new NotFoundError("This room does not exist.");
      }

      roomMember = await RoomMembers.getRoomMember(
        ["member_fk_id", "room_fk_id"],
        [identifier, room[0].message_room_id],
      );

      if (!roomMember) {
        throw new NotFoundError("This message member does not exist.");
      }

      deleteMember = await RoomMembers.deleteRoomMember(
        ["member_id"],
        [roomMember[0]?.member_id],
      );

      if (!deleteMember) {
        throw new BadRequestError("Error in deleting user in the message.");
      }

      const allMembers = await RoomMembers.getAllRoomMembers(
        ["room_fk_id"],
        [roomMember[0]?.room_fk_id],
      );

      console.log(allMembers);

      if (!allMembers || !allMembers.length) {
        const deleteRoom = await MessageRooms.deleteMessageRoom(
          ["message_room_id"],
          [roomMember[0]?.room_fk_id],
        );

        console.log(`Group deleted: ${!!deleteRoom}`);
      } else if (allMembers.length) {
        const sortedMembers = allMembers.sort(
          (a, b) => a?.date_added - b?.date_added,
        );

        const firstMember = sortedMembers[0];

        const reassignOwner = await MessageRooms.updateMessageCreator(
          roomMember[0]?.room_fk_id,
          firstMember.user_id,
        );

        console.log(`Owner reassigned: ${!!reassignOwner}`);
      }

      return res
        .status(StatusCodes.OK)
        .json({ members: allMembers.map((member) => member.user_uuid) });

    default:
  }
};

const getRoomMembers = async (req, res) => {
  const { messageRoom, roomType } = req.query;
  const { id } = req.user;

  const room = await MessageRooms.getMessageRoom(messageRoom, roomType, id);

  if (!room) {
    throw new NotFoundError("This message room does not exist.");
  }

  const allRoomMembers = await RoomMembers.getAllRoomMembers(
    ["message_room_id"],
    [room[0]?.message_room_id],
  );

  if (!allRoomMembers) {
    throw new BadRequestError("Error in getting all members in the message.");
  }

  res.status(StatusCodes.OK).json(allRoomMembers);
};

const getPossibleRoomMembers = async (req, res) => {
  const { messageRoom, roomType } = req.query;
  const { id } = req.user;

  const room = await MessageRooms.getMessageRoom(messageRoom, roomType, id);

  if (!room) {
    throw new NotFoundError("This message room does not exist.");
  }

  const allRoomMembers = await RoomMembers.getPossibleMembers(
    room[0]?.message_room_id,
    id,
  );

  if (!allRoomMembers) {
    throw new BadRequestError("Error in getting all members in the message.");
  }

  res.status(StatusCodes.OK).json(allRoomMembers);
};

export const getAllRoomMembers = async (req, res) => {
  const { type } = req.query;

  if (type === "all members") {
    await getRoomMembers(req, res);
    return;
  }

  if (type === "possible members") {
    await getPossibleRoomMembers(req, res);
    return;
  }
};

export const getRoomMember = async (req, res) => {
  const { identifier } = req.params;

  const roomMember = await RoomMembers.getRoomMember(
    ["message_member_uuid"],
    [identifier],
  );

  if (!roomMember) {
    throw new NotFoundError("This message member does not exist.");
  }

  res.status(StatusCodes.OK).json(roomMember[0]);
};
