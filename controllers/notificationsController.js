import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { Notifications } from "../models/Notifications.js";

export const getNotifications = async (req, res) => {
  const { id } = req.user;

  const notifications = await Notifications.getNotifications(id);

  if (!notifications) {
    throw new BadRequestError(`Error in getting notifications. Try again later.`);
  }

  res.status(StatusCodes.OK).json(notifications);
};
