import { Router } from "express";

import bitcoinController from "../controllers/bitcoinController.js";

const bitcoinRouter = Router();

bitcoinRouter.get("/details/:address", bitcoinController.getBitcoinAddressData);

export default bitcoinRouter;