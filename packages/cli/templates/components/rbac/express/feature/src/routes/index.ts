import { Router } from "express";
import UserRouter from "../modules/user/user.routes";

const router = Router();

router.use("/v1/users", UserRouter);

export default router;
