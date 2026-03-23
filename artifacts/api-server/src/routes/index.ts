import { Router, type IRouter } from "express";
import healthRouter from "./health";
import personaRouter from "./persona/index";
import authRouter from "./auth/index";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(personaRouter);

export default router;
