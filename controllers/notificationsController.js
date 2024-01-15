import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { Notifications } from "../models/Notifications.js";
import { UserSettings } from "../models/UserSettings.js";

export const getNotifications = async (req, res) => {
  const { id } = req.user;

  const settings = await UserSettings.getUserSettings(["user_id"], [id]);

  if (!settings) {
    throw new NotFoundError(`This user's settings does not exist. Try again later.`);
  }

  const { associate_invite, message_notification, task_deadline, task_update } = settings[0];

  const notifications = await Notifications.getNotifications(
    id,
    associate_invite,
    message_notification,
    task_deadline,
    task_update
  );

  if (!notifications) {
    throw new BadRequestError(`Error in getting notifications. Try again later.`);
  }

  res.status(StatusCodes.OK).json(notifications);
};
