import { StatusCodes } from "http-status-codes";
import { hashPassword } from "../utils";
import { Users } from "../models/Users.js";
import { BadRequestError, UnauthorizedError } from "../errors/index.js";

export const getUser = async (req, res) => {
  const { user_uuid } = req.params;
  const { id } = req.user;

  const user = await Users.getUser("user_uuid", user_uuid);

  if (user.user_id !== id) {
    throw new UnauthorizedError("You are not allowed to access other account.");
  }

  if (!user) {
    throw new BadRequestError(`Error in getting your data. Try again later.`);
  }

  res.status(StatusCodes.OK).json(user);
};

const updateUserIdentifier = async (req, res) => {
  const { userData } = req.body;
  const { user_uuid } = req.params;
  const { id } = req.user;
  const { name, surname, email } = userData;

  const user = await Users.getUser("user_uuid", user_uuid);

  if (user.user_id !== id) {
    throw new UnauthorizedError("You are not allowed to access other account.");
  }

  const updateUser = await Users.updateUserIdentifier(name, surname, email, "user_id", user.user_id);

  if (!updateUser) {
    throw new BadRequestError("Error in updating your identifiers.");
  }

  res.status(StatusCodes.OK).json(updateUser);
};

const updateUserPassword = async (req, res) => {
  const { userData } = req.body;
  const { user_uuid } = req.params;
  const { id } = req.user;
  const { password } = userData;

  const user = await Users.getUser("user_uuid", user_uuid);

  if (user.user_id !== id) {
    throw new UnauthorizedError("You are not allowed to access other account.");
  }

  const hashedPassword = await hashPassword(password);

  const updateUser = await Users.updateUserPassword(hashedPassword, "user_id", user.user_id);

  if (!updateUser) {
    throw new BadRequestError("Error in updating your password.");
  }

  res.status(StatusCodes.OK).json(updateUser);
};

export const updateUser = async (req, res) => {
  const { user_uuid } = req.params;
  const { type } = req.query;

  const user = await Users.getUser("user_uuid", user_uuid);

  if (user.user_id !== id) {
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
