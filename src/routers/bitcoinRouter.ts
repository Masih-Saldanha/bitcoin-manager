import { Router } from "express";

import bitcoinController from "../controllers/bitcoinController.js";
import { validateSchema } from "../middlewares/schemaValidationMiddleware.js";
import sendBitcoinSchema from "../schemas/sendBitcoinSchema.js";

const bitcoinRouter = Router();

bitcoinRouter.get("/details/:address", bitcoinController.getBitcoinAddressData);
bitcoinRouter.get("/balance/:address", bitcoinController.getBitcoinBalance);
bitcoinRouter.post("/send/", validateSchema(sendBitcoinSchema.sendBitcoinData), bitcoinController.utxoNeededToSendBitcoin);
bitcoinRouter.get("/tx/:tx", bitcoinController.getTransactionInfo);

export default bitcoinRouter;