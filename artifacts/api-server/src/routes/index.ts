import { Router, type IRouter } from "express";
import healthRouter from "./health";
import personaRouter from "./persona/index";
import authRouter from "./auth/index";
import kenaliDiriRouter from "./kenali-diri/index";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(personaRouter);
router.use("/v1/admin/kenali-diri", kenaliDiriRouter);

export default router;
