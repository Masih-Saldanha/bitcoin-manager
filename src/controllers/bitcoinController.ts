import { Request, Response } from "express";

import bitcoinService from "../services/bitcoinService.js";

async function getBitcoinAddressData(req: Request, res: Response) {
  const address = req.params.address;

  const addressData = await bitcoinService.getBitcoinAddressData(address);

  res.send(addressData).status(200);
};

const bitcoinController = {
  getBitcoinAddressData,
};

export default bitcoinController;