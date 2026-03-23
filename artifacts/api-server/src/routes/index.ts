import { Router, type IRouter } from "express";
import healthRouter from "./health";
import personaRouter from "./persona/index";

const router: IRouter = Router();

router.use(healthRouter);
router.use(personaRouter);

export default router;
