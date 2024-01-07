import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

export const getNotifications = async (req, res) => {
  const { id } = req.user;

  res.status(StatusCodes.OK).json(id);
};
