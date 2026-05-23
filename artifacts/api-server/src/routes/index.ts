import { Router, type IRouter } from "express";
import healthRouter from "./health";
import analyzeRouter from "./analyze";
import historyRouter from "./history";
import passwordRouter from "./password";

const router: IRouter = Router();

router.use(healthRouter);
router.use(analyzeRouter);
router.use(historyRouter);
router.use(passwordRouter);

export default router;
