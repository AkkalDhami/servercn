import { Router } from "express";
import { validateRequest } from "../../shared/middlewares/validate-request";
import { createUserSchema } from "./user.validation";
import { STATUS_CODES } from "../../shared/constants/status-codes";

const router = Router();

router.post("/", validateRequest(createUserSchema), (req, res) => {
  return res.status(STATUS_CODES.CREATED).json({
    success: true,
    message: "User created successfully",
    data: req.body
  });
});

export default router;
