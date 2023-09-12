import { StatusCodes } from "http-status-codes";

export const errorMiddleware = (err, req, res, next) => {
  console.log(err);

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Sorry, there was a problem. Please try again later.",
  };

  if (err?.errno === 1062) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = `Input for ${err.sqlMessage.split(" ")[2]} already exists`;
  }

  res.status(customError.statusCode).send(customError.message);
};
