import { Router } from "express";
import { submitResponse, myResponses ,getResponsesByForm} from "../controllers/surveyController";

import { authenticate } from "../middleware/auth";


const router = Router();

router.post("/submit", authenticate, submitResponse);
router.get("/my", authenticate, myResponses);
router.get("/:survey_form_id/responses", authenticate, getResponsesByForm);




export default router;