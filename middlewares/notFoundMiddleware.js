import { StatusCodes } from "http-status-codes";

export const notFoundMiddleware = (req, res, next) => {
  res.status(StatusCodes.NOT_FOUND).send("This service is not ours.");
};
