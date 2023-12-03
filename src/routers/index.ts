import { Router } from "express";

import bitcoinRouter from "./bitcoinRouter.js";

const router = Router();

router.use(bitcoinRouter);

export default router;