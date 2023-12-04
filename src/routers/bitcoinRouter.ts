import { Router } from "express";

import bitcoinController from "../controllers/bitcoinController.js";

const bitcoinRouter = Router();

bitcoinRouter.get("/details/:address", bitcoinController.getBitcoinAddressData);
bitcoinRouter.get("/balance/:address", bitcoinController.getBitcoinBalance);
bitcoinRouter.get("/tx/:tx", bitcoinController.getTransactionInfo);

export default bitcoinRouter;