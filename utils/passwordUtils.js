import bcryptjs from "bcryptjs";

export const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(10);
  const hash = await bcryptjs.hash(password, salt);
  return hash;
};

export const comparePassword = async (candidatePassword, password) => {
  const isCorrect = await bcryptjs.compare(candidatePassword, password);
  return isCorrect;
};
