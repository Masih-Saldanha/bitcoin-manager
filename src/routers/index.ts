import { Router } from "express";

import healthRouter from "./healthRouter.js";
import bitcoinRouter from "./bitcoinRouter.js";

const router = Router();

router.use(healthRouter);
router.use(bitcoinRouter);

export default router;