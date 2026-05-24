import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import analyzeRouter from "./analyze";
import historyRouter from "./history";
import passwordRouter from "./password";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(analyzeRouter);
router.use(historyRouter);
router.use(passwordRouter);

export default router;
