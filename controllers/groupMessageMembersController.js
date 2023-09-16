import { v4 as uuidv4 } from "uuid";
import { GroupMessageMembers } from "../models/GroupMessageMembers";
import { BadRequestError, NotFoundError } from "../errors";
import { StatusCodes } from "http-status-codes";
import { GroupMessageRooms } from "../models/GroupMessageRooms";

export const createGroupMessageMember = async (req, res) => {
  const { memberId, roomId } = req.body;
  const groupMessageMemberUUID = uuidv4();

  const groupMessageMember = new GroupMessageMembers(groupMessageMemberUUID, memberId, roomId);

  const newGroupMessageMember = await groupMessageMember.createGroupMessageMember();

  if (!newGroupMessageMember) {
    throw new BadRequestError("Error in adding user in the group message.");
  }

  res.status(StatusCodes.OK).json(newGroupMessageMember);
};

export const deleteGroupMessageMember = async (req, res) => {
  const { group_message_member_uuid } = req.params;

  const groupMessageMember = await GroupMessageMembers.getGroupMessageMember(
    "group_message_member_uuid",
    group_message_member_uuid
  );

  if (!groupMessageMember) {
    throw new NotFoundError("This group message member does not exist.");
  }

  const deleteMember = await GroupMessageMembers.deleteGroupMessageMember(
    "group_message_member_id",
    groupMessageMember.group_message_member_id
  );

  if (!deleteMember) {
    throw new BadRequestError("Error in deleting user in the group message.");
  }

  res.status(StatusCodes.OK).json(deleteMember);
};

export const getAllGroupMessageMembers = async (req, res) => {
  const { groupMessageRoomId } = req.body;

  const groupMessageRoom = await GroupMessageRooms.getGroupMessageRoom("group_message_room_id", groupMessageRoomId);

  if (!groupMessageRoom) {
    throw new NotFoundError("This group message room does not exist.");
  }

  const allGroupMessageMembers = await GroupMessageMembers.getAllGroupMessageMembers(
    "group_message_room_id",
    groupMessageRoomId
  );

  if (!allGroupMessageMembers) {
    throw new BadRequestError("Error in getting all members in the group message.");
  }

  res.status(StatusCodes.OK).json(allGroupMessageMembers);
};
