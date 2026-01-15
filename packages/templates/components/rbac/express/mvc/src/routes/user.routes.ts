import { Response, Router } from "express";
import { verifyAuthentication } from "../middlewares/verify-auth";
import { UserRequest } from "../types/user";
import { ApiResponse } from "../utils/api-response";
import { authorizeRoles } from "../middlewares/authorize-role";

const router = Router();

router.get("/profile", verifyAuthentication, authorizeRoles("user", "admin"), (req: UserRequest, res: Response) => {
  return ApiResponse.ok(res, "User profile", req.user);
});

export default router;
