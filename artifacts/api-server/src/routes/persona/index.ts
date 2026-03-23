import { Router } from "express";
import missionsRouter from "./missions";
import journeyRouter from "./journey";

const router = Router();

router.use("/v1/admin/persona", missionsRouter);
router.use("/v1/admin/persona", journeyRouter);

export default router;
