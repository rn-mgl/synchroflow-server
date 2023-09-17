import { Router } from "express";
import { createAssociate, deleteAssociate, getAllAssociates } from "../controllers/associatesController.js";

const router = Router();

router.route("/").post(createAssociate).get(getAllAssociates);
router.route("/:associate_uuid").delete(deleteAssociate);

export default router;
