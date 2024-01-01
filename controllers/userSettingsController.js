import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { UserSettings } from "../models/UserSettings.js";

export const updateUserSettings = async (req, res) => {
  const { user_settings_uuid } = req.params;
  const { userSettingsData } = req.body;
  const { notificationSound, messageNotification, taskUpdate, taskDeadline, associateInvite } = userSettingsData;

  const userSettings = await UserSettings.getUserSettings(["user_settings_uuid"], [user_settings_uuid]);

  if (!userSettings) {
    throw new NotFoundError(`This user setting does not exist.`);
  }

  const updateUserSetting = await UserSettings.updateUserSettings(
    userSettings[0]?.user_settings_id,
    notificationSound,
    messageNotification,
    taskUpdate,
    taskDeadline,
    associateInvite
  );

  if (!updateUserSetting) {
    throw new BadRequestError(`Error in updating user settings. Try again`);
  }

  res.status(StatusCodes.OK).json(updateUserSetting);
};

export const getUserSettings = async (req, res) => {
  const { user_settings_uuid } = req.params;

  const userSettings = await UserSettings.getUserSettings(["user_settings_uuid"], [user_settings_uuid]);

  if (!userSettings) {
    throw new NotFoundError(`This user setting does not exist.`);
  }

  res.status(StatusCodes.OK).json(userSettings[0]);
};
