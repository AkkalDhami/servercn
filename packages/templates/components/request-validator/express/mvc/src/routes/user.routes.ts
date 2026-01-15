import { Router } from "express";
import { validateRequest } from "../middlewares/validate-request";
import { createUserSchema } from "../validations/user.validation";
import { STATUS_CODES } from "../constants/status-codes";

const router = Router();

router.post("/", validateRequest(createUserSchema), (req, res) => {
  return res.status(STATUS_CODES.CREATED).json({
    success: true,
    message: "User created successfully",
    data: req.body
  });
});

export default router;
