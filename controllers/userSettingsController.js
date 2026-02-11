import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { UserSettings } from "../models/UserSettings.js";

export const updateUserSettings = async (req, res) => {
  const { id } = req.user;
  const { settings } = req.body;
  const {
    notification_sound,
    message_notification,
    task_update,
    task_deadline,
    associate_invite,
  } = settings;

  const userSettings = await UserSettings.getUserSettings(["user_id"], [id]);

  if (!userSettings) {
    throw new NotFoundError(`This user setting does not exist.`);
  }

  const updateUserSetting = await UserSettings.updateUserSettings(
    userSettings[0]?.user_settings_id,
    notification_sound,
    message_notification,
    task_update,
    task_deadline,
    associate_invite,
  );

  if (!updateUserSetting) {
    throw new BadRequestError(`Error in updating user settings. Try again`);
  }

  return res.status(StatusCodes.OK).json(updateUserSetting);
};

export const getUserSettings = async (req, res) => {
  const { id } = req.user;

  const userSettings = await UserSettings.getUserSettings(["user_id"], [id]);

  if (!userSettings) {
    throw new NotFoundError(`This user setting does not exist.`);
  }

  return res.status(StatusCodes.OK).json(userSettings[0]);
};
