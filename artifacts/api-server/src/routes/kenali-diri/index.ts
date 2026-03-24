import { Router } from "express";
import riasecRouter from "./riasec";

const router = Router();

router.use("/riasec", riasecRouter);

export default router;
