import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/badRequestError.js";
import { Dashboard } from "../models/Dashboard.js";

export const getDashboardData = async (req, res) => {
  const { id } = req.user;

  const dashboardData = await Dashboard.getDashboardData(id);

  if (!dashboardData) {
    throw new BadRequestError(
      `Error in getting dashboard data. Try again later.`,
    );
  }

  res.status(StatusCodes.OK).json(dashboardData);
};
