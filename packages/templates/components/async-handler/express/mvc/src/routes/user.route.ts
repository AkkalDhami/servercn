import { NextFunction, Request, Response, Router } from "express";
import { AsyncHandler } from "../utils/async-handler";

const router = Router();

router.get(
  "/",
  AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    /*
     * business logic
     * your actual code
     */
  })
);

export default router;
