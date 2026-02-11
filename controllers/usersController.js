import { StatusCodes } from "http-status-codes";
import { comparePassword, hashPassword, randomAvatar } from "../utils/index.js";
import { Users } from "../models/Users.js";
import { BadRequestError, UnauthorizedError } from "../errors/index.js";

export const getUser = async (req, res) => {
  const { user_uuid } = req.params;
  const { id } = req.user;

  const user = await Users.getUser(["user_uuid"], [user_uuid]);

  if (user[0]?.user_id !== id) {
    throw new UnauthorizedError("You are not allowed to access other account.");
  }

  if (!user) {
    throw new BadRequestError(`Error in getting your data. Try again later.`);
  }

  return res.status(StatusCodes.OK).json(user[0]);
};

const updateUserIdentifier = async (req, res) => {
  const { userData } = req.body;
  const { user_uuid } = req.params;
  const { id } = req.user;
  const { name, surname, role, status } = userData;

  const user = await Users.getUser(["user_uuid"], [user_uuid]);

  if (user[0]?.user_id !== id) {
    throw new UnauthorizedError("You are not allowed to access other account.");
  }

  if (!userData.image) {
    userData.image = randomAvatar();
  }

  const updateUser = await Users.updateUserIdentifier(
    name,
    surname,
    role,
    status,
    userData.image,
    user[0]?.user_id,
  );

  if (!updateUser) {
    throw new BadRequestError("Error in updating your identifiers.");
  }

  return res.status(StatusCodes.OK).json(updateUser);
};

const updateUserPassword = async (req, res) => {
  const { password } = req.body;
  const { user_uuid } = req.params;
  const { id } = req.user;

  const user = await Users.getUser(["user_uuid"], [user_uuid]);

  if (user[0]?.user_id !== id) {
    throw new UnauthorizedError("You are not allowed to access other account.");
  }

  const isCorrect = await comparePassword(
    password.currentPassword.text,
    user[0]?.password,
  );

  if (!isCorrect) {
    throw new BadRequestError(
      "The current password you entered does not match your recorded password.",
    );
  }

  const hashedPassword = await hashPassword(password.newPassword.text);

  const updateUser = await Users.updateUserPassword(
    hashedPassword,
    user[0]?.user_id,
  );

  if (!updateUser) {
    throw new BadRequestError("Error in updating your password.");
  }

  return res.status(StatusCodes.OK).json(updateUser);
};

export const updateUser = async (req, res) => {
  const { user_uuid } = req.params;
  const { id } = req.user;
  const { type } = req.query;

  const user = await Users.getUser(["user_uuid"], [user_uuid]);

  if (user[0]?.user_id !== id) {
    throw new UnauthorizedError("You are not allowed to access other account.");
  }

  switch (type) {
    case "identifier":
      await updateUserIdentifier(req, res);
      return;
    case "password":
      await updateUserPassword(req, res);
    default:
      return;
  }
};
