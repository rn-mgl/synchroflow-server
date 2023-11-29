import { Router } from "express";
import {
  createAssociate,
  deleteAssociate,
  getAllAssociates,
  getAssociate,
} from "../controllers/associatesController.js";

const router = Router();

router.route("/").post(createAssociate).get(getAllAssociates);
router.route("/:associate_uuid").get(getAssociate).delete(deleteAssociate);

export default router;
