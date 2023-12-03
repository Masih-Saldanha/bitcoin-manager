import { Request, Response } from "express";

async function getBitcoinAddressData(req: Request, res: Response) {
  const address = req.params.address;

  res.send(address).status(200);
};

const bitcoinController = {
  getBitcoinAddressData,
};

export default bitcoinController;