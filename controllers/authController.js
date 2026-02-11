import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/index.js";
import { UserSettings } from "../models/UserSettings.js";
import { Users } from "../models/Users.js";
import {
  comparePassword,
  createLoginToken,
  hashPassword,
  randomAvatar,
} from "../utils/index.js";
import { createEmailToken } from "../utils/tokenUtils.js";
import {
  sendPasswordResetMail,
  sendVerificationMail,
} from "./mailController.js";

export const registerUser = async (req, res) => {
  const { registerCredentials } = req.body;
  const { name, surname, email, password } = registerCredentials;

  const userUUID = uuidv4();
  const hashedPassword = await hashPassword(password);
  const image = randomAvatar();

  const user = new Users(userUUID, name, surname, email, hashedPassword, image);

  const newUser = await user.createUser();

  if (!newUser) {
    throw new BadRequestError(
      "Error in creating your account. Try again later.",
    );
  }

  const userSettingsUUID = uuidv4();

  const userSettings = new UserSettings(userSettingsUUID, newUser.insertId);

  const createUserSettings = await userSettings.createUserSettings();

  if (!createUserSettings) {
    throw new BadRequestError(
      "Error in initializing your settings. Try again later.",
    );
  }

  const token = createEmailToken(
    newUser.insertId,
    userUUID,
    `${name} ${surname}`,
    email,
  );
  const data = await sendVerificationMail(`${name} ${surname}`, email, token);

  return res.status(StatusCodes.OK).json(token);
};

export const loginUser = async (req, res) => {
  const { loginCredentials } = req.body;
  const { candidateEmail, candidatePassword } = loginCredentials;

  const userEmail = await Users.getUser(["email"], [candidateEmail]);

  if (!userEmail || !userEmail[0]) {
    throw new BadRequestError(
      "There is no account found with the given email.",
    );
  }

  const { user_id, user_uuid, name, surname, email, password, is_verified } =
    userEmail[0];

  const isCorrectPassword = await comparePassword(candidatePassword, password);

  if (!isCorrectPassword) {
    throw new UnauthorizedError(`The email and password does not match.`);
  }

  const token = createLoginToken(
    user_id,
    user_uuid,
    `${name} ${surname}`,
    email,
  );

  const primary = {
    id: user_id,
    uuid: user_uuid,
    name: `${name} ${surname}`,
    email,
    token: `Bearer ${token}`,
    verified: is_verified,
  };

  if (!is_verified) {
    const emailToken = createEmailToken(
      user_id,
      user_uuid,
      `${name} ${surname}`,
      email,
    );

    const data = await sendVerificationMail(
      `${name} ${surname}`,
      email,
      emailToken,
    );
  }

  return res.status(StatusCodes.OK).json(primary);
};

export const verifyUser = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw new BadRequestError(`Your token is not valid for verification.`);
  }

  const verify = jwt.verify(token, process.env.JWT_SECRET);

  if (!verify.id || !verify.uuid || !verify.name || !verify.email) {
    throw new BadRequestError(`Your token is not valid for verification.`);
  }

  const user = await Users.getUser(["user_id"], [verify.id]);

  if (!user) {
    throw new NotFoundError(`This account does not exist.`);
  }

  const verifyUser = await Users.updateUserVerification(user[0]?.user_id);

  if (!verifyUser) {
    throw new BadRequestError(
      `Error in verifying the account. Try again later.`,
    );
  }

  return res.status(StatusCodes.OK).json(verify);
};

export const forgotPassword = async (req, res) => {
  const { candidateName, candidateSurname, candidateEmail } = req.body;

  const user = await Users.getUser(
    ["name", "surname", "email"],
    [candidateName, candidateSurname, candidateEmail],
  );

  if (!user[0]) {
    throw new NotFoundError(`There is no user with the given identifiers.`);
  }

  const { user_id, user_uuid, name, surname, email } = user[0];

  const token = createEmailToken(
    user_id,
    user_uuid,
    `${name} ${surname}`,
    email,
  );

  const passwordResetMail = await sendPasswordResetMail(
    `${name} ${surname}`,
    email,
    token,
  );

  return res.status(StatusCodes.OK).json({ token, passwordResetMail });
};

export const newPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

  const { id } = verifiedToken;

  const user = await Users.getUser(["user_id"], [id]);

  if (!user[0]) {
    throw new NotFoundError(`There is no user with the given identifiers.`);
  }

  const hashedPassword = await hashPassword(newPassword.text);

  const newUserPassword = await Users.updateUserPassword(hashedPassword, id);

  if (!newUserPassword) {
    throw new BadRequestError(
      `Error in changing your password. Try again later.`,
    );
  }

  return res.status(StatusCodes.OK).json(newUserPassword);
};
