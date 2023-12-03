import { Router } from "express";

const bitcoinRouter = Router();

bitcoinRouter.get("/details/:address");

export default bitcoinRouter;