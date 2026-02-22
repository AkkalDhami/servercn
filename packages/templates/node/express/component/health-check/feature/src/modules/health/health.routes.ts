import { Router } from "express";
import { healthCheck, detailedHealthCheck } from "./health.controller";

const router = Router();

router.get("/", healthCheck);
router.get("/detailed", detailedHealthCheck);

export default router;
