import { v2 } from "cloudinary";
import { v4 as uuidv4 } from "uuid";
import { BadRequestError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import fs from "fs";

export const uploadFiles = async (req, res) => {
  const file = req.files.file;
  const tempFilePath = file.tempFilePath;
  const uuid = uuidv4();

  const data = await v2.uploader.upload(tempFilePath, {
    resource_type: "auto",
    unique_filename: true,
    public_id: `${file.name}__${file.size}__${uuid}`,
    use_filename: true,
    folder: "synchroflow-uploads",
  });

  if (!data) {
    throw new BadRequestError(`Error in uploading file. Try again later.`);
  }

  fs.unlinkSync(tempFilePath);
  return res.status(StatusCodes.OK).json(data.secure_url);
};
