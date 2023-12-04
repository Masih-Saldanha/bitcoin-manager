import { Request, Response } from "express";

import bitcoinService from "../services/bitcoinService.js";

async function getBitcoinAddressData(req: Request, res: Response) {
  const address = req.params.address;

  const addressData = await bitcoinService.getBitcoinAddressData(address);

  res.send(addressData).status(200);
};

async function getBitcoinBalance(req: Request, res: Response) {
  const address = req.params.address;

  const balanceData = await bitcoinService.getBitcoinBalance(address);

  res.json(balanceData).status(200);
};

async function getTransactionInfo(req: Request, res: Response) {
  const tx = req.params.tx;

  const transactionData = await bitcoinService.getTransactionInfo(tx);

  res.json(transactionData).status(200);
};

const bitcoinController = {
  getBitcoinAddressData,
  getBitcoinBalance,
  getTransactionInfo,
};

export default bitcoinController;