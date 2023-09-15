import jwt from "jsonwebtoken";

export const createToken = (id, uuid, name, email) => {
  const token = jwt.sign({ id, uuid, name, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TTL });
  return token;
};
