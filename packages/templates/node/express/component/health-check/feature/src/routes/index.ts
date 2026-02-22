import { Router } from "express";
import HealthRouter from "../modules/health/health.routes";

const router = Router();

router.use("/v1/health", HealthRouter);

export default router;
