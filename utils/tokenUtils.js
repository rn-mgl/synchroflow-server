import jwt from "jsonwebtoken";

export const createLoginToken = (id, uuid, name, email) => {
  const token = jwt.sign({ id, uuid, name, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TTL });
  return token;
};

export const createEmailToken = (id, uuid, name, email) => {
  const token = jwt.sign({ id, uuid, name, email }, process.env.JWT_SECRET, { expiresIn: process.env.EMAIL_TTL });
  return token;
};
