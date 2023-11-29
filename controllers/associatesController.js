import { v4 as uuidv4 } from "uuid";
import { Associates } from "../models/Associates.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";

export const createAssociate = async (req, res) => {
  const { associateIs } = req.body;
  const { id } = req.user;

  const associateUUID = uuidv4();

  const associate = new Associates(associateUUID, id, associateIs);
  const newAssociate = await associate.createAssociate();

  if (!newAssociate) {
    throw new BadRequestError("Error in establishing associate connection. Try again later.");
  }

  res.status(StatusCodes.OK).json(newAssociate);
};

export const deleteAssociate = async (req, res) => {
  const { associate_uuid } = req.params;

  const associate = await Associates.getAssociate(["associate_uuid"], [associate_uuid]);

  if (!associate) {
    throw new NotFoundError("This associate connection no longer exist.");
  }

  const deleteConnection = await Associates.deleteAssociate(["associate_id"], [associate.associate_id]);

  if (!deleteConnection) {
    throw new NotFoundError("Error in deleting associate connection. Try again later.");
  }

  res.status(StatusCodes.OK).json(deleteConnection);
};

export const getAllAssociates = async (req, res) => {
  const { id } = req.user;

  const associates = await Associates.getAllAssociates(["associate_of"], [id]);

  if (!associates) {
    throw new BadRequestError("Error in getting your associates. Try again later.");
  }

  res.status(StatusCodes.OK).json(associates);
};
