import { Response, Router } from "express";
import { UserRequest } from "../../types/user";
import { verifyAuthentication } from "../../shared/middlewares/verify-auth";
import { ApiResponse } from "../../shared/utils/api-response";

const router = Router();

router.get("/profile", verifyAuthentication, (req: UserRequest, res: Response) => {
  return ApiResponse.ok(res, "User profile", req.user);
});

export default router;
