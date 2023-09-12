import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "./customAPIError.js";

export class UnauthorizedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
