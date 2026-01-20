import { UnauthorizedError } from "../errors/index.js";
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      throw new UnauthorizedError(
        "You are unauthorized to enter here. Log in first.",
      );
    }

    const verify = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

    req.user = {
      id: verify.id,
      uuid: verify.uuid,
      name: verify.name,
      email: verify.email,
    };

    next();
  } catch (error) {
    console.log(error);
    throw new UnauthorizedError(
      "You are unauthorized to enter here. Log in first.",
    );
  }
};
