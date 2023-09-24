import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import { hashPassword, comparePassword, createLoginToken, randomAvatar } from "../utils/index.js";
import { Users } from "../models/Users.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors/index.js";
import jwt from "jsonwebtoken";
import { sendVerificationMail } from "./mailController.js";
import { createEmailToken } from "../utils/tokenUtils.js";

export const registerUser = async (req, res) => {
  const { registerCredentials } = req.body;
  const { name, surname, email, password } = registerCredentials;

  const userUUID = uuidv4();
  const hashedPassword = await hashPassword(password);
  const image = randomAvatar();

  const user = new Users(userUUID, name, surname, email, hashedPassword, image);

  const newUser = await user.createUser();

  if (!newUser) {
    throw new BadRequestError("Error in creating your account. Try again later.");
  }

  const token = createEmailToken(newUser.insertId, userUUID, `${name} ${surname}`, email);

  res.status(StatusCodes.OK).json(token);

  const data = await sendVerificationMail(`${name} ${surname}`, email, token);
};

export const loginUser = async (req, res) => {
  const { loginCredentials } = req.body;
  const { candidateEmail, candidatePassword } = loginCredentials;

  const userEmail = await Users.getUser("email", candidateEmail);

  if (!userEmail) {
    throw new BadRequestError("There is no account found with the given email.");
  }

  const { user_id, user_uuid, name, surname, email, password } = userEmail;

  const isCorrectPassword = await comparePassword(candidatePassword, password);

  if (!isCorrectPassword) {
    throw new UnauthorizedError(`The email and password does not match.`);
  }

  const token = createLoginToken(user_id, user_uuid, `${name} ${surname}`, email);

  const primary = { id: user_id, uuid: user_uuid, name: `${name} ${surname}`, email, token: `Bearer ${token}` };

  res.status(StatusCodes.OK).json(primary);
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

  const user = await Users.getUser("user_id", verify.id);

  if (!user) {
    throw new NotFoundError(`This account does not exist.`);
  }

  const verifyUser = await Users.updateUserVerification("user_id", verify.id);

  if (!verifyUser) {
    throw new BadRequestError(`Error in verifying the account. Try again later.`);
  }

  res.status(StatusCodes.OK).json(verify);
};
