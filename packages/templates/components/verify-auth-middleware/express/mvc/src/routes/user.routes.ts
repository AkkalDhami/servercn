import { Response, Router } from "express";
import { verifyAuthentication } from "../middlewares/verify-auth";
import { UserRequest } from "../types/user";
import { ApiResponse } from "../utils/api-response";

const router = Router();

router.get("/profile", verifyAuthentication, (req: UserRequest, res: Response) => {
  return ApiResponse.ok(res, "User profile", req.user);
});

export default router;
