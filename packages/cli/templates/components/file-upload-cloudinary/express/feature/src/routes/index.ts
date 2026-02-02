import { Router } from "express";
import UploadRouter from "../modules/upload/upload.routes";

const router = Router();

router.use("/v1/uploads", UploadRouter);

export default router;
