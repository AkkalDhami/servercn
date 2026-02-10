import { Router } from "express";
const router = Router();

router.get("/v1/health/", (req, res) => {
  res.json({ message: "Server is running" });
});

export default router;
