import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { Tasks } from "../models/Tasks.js";
import { TaskInvites } from "../models/TaskInvites.js";
import { Users } from "../models/Users.js";

export const createTaskInvite = async (req, res) => {
  const { taskUUID, associatesToInvite, inviteMessage } = req.body;
  const { id } = req.user;

  const task = await Tasks.getTask(["task_uuid"], [taskUUID]);

  if (!task) {
    throw new NotFoundError(
      "The task you are inviting someone to does not exist.",
    );
  }

  associatesToInvite.map(async (associate) => {
    const invitedUser = await Users.getUser(["user_uuid"], [associate]);

    if (!invitedUser) {
      throw new NotFoundError(`A user does not exist in Synchroflow.`);
    }

    const taskInviteUUID = uuidv4();

    const taskInvite = new TaskInvites(
      taskInviteUUID,
      task[0]?.task_id,
      id,
      invitedUser[0]?.user_id,
      inviteMessage,
    );

    const newTaskInvite = await taskInvite.createTaskInvite();

    if (!newTaskInvite) {
      throw new BadRequestError("Error in inviting someone. Try again later.");
    }
  });

  res.status(StatusCodes.OK).json({ msg: "Sent successfully" });
};

export const deleteTaskInvite = async (req, res) => {
  const { task_invite_uuid } = req.params;

  const taskInvite = await TaskInvites.getTaskInvite(
    ["task_invite_uuid"],
    [task_invite_uuid],
  );

  if (!taskInvite) {
    throw new NotFoundError("The invite does not exist.");
  }

  const deleteInvite = await TaskInvites.deleteTaskInvite(
    ["task_invite_id"],
    [taskInvite[0]?.task_invite_id],
  );

  if (!deleteInvite) {
    throw new BadRequestError("Error in deleting invite. Try again later.");
  }

  res.status(StatusCodes.OK).json(deleteInvite);
};

export const updateTaskInviteStatus = async (req, res) => {
  const { inviteStatus } = req.body;
  const { task_invite_uuid } = req.params;

  const taskInvite = await TaskInvites.getTaskInvite(
    ["task_invite_uuid"],
    [task_invite_uuid],
  );

  if (!taskInvite) {
    throw new NotFoundError("The invite does not exist.");
  }

  const updateInvite = await TaskInvites.updateTaskInviteStatus(
    [inviteStatus],
    ["task_invite_id"],
    [taskInvite[0]?.task_invite_id],
  );

  if (!updateInvite) {
    throw new BadRequestError(
      "Error in updating invite status. Try again later.",
    );
  }

  res.status(StatusCodes.OK).json(updateInvite);
};

export const getTaskInvite = async (req, res) => {
  const { task_invite_uuid } = req.params;

  const taskInvite = await TaskInvites.getTaskInvite(
    ["task_invite_uuid"],
    [task_invite_uuid],
  );

  if (!taskInvite) {
    throw new NotFoundError("The invite does not exist.");
  }

  res.status(StatusCodes.OK).json(taskInvite[0]);
};

const getAllSentTaskInvites = async (req, res) => {
  const { id } = req.user;

  const allTaskInvites = await TaskInvites.getAllTaskInvites(
    ["invited_by"],
    [id],
  );

  if (!allTaskInvites) {
    throw new BadRequestError("Error in getting all your sent task invites.");
  }

  res.status(StatusCodes.OK).json(allTaskInvites);
};

const getAllReceivedTaskInvites = async (req, res) => {
  const { id } = req.user;

  const allTaskInvites = await TaskInvites.getAllTaskInvites(
    ["invited_associate"],
    [id],
  );

  if (!allTaskInvites) {
    throw new BadRequestError(
      "Error in getting all your received task invites.",
    );
  }

  res.status(StatusCodes.OK).json(allTaskInvites);
};

const getAllAssociatesToInvite = async (req, res) => {
  const { id } = req.user;
  const { taskUUID, searchFilter } = req.query;

  const task = await Tasks.getTask(["task_uuid"], [taskUUID]);

  if (!task) {
    throw new NotFoundError(
      `The task you are inviting someone to does not exist.`,
    );
  }

  const allTaskInvites = await TaskInvites.getAllAssociatesToInvite(
    id,
    task[0]?.task_id,
    searchFilter,
  );

  if (!allTaskInvites) {
    throw new BadRequestError(
      "Error in getting all your received task invites.",
    );
  }

  res.status(StatusCodes.OK).json(allTaskInvites);
};

export const getAllTaskInvites = async (req, res) => {
  const { type } = req.query;

  switch (type) {
    case "sent":
      await getAllSentTaskInvites(req, res);
      return;

    case "received":
      await getAllReceivedTaskInvites(req, res);
      return;

    case "invite associates":
      await getAllAssociatesToInvite(req, res);
      return;

    default:
      return;
  }
};
