import axios from "axios";

import { throwError } from "../utils/errorTypeUtils.js";

async function getBitcoinAddressData(address: string) {
  try {
    const response = await axios.get(`https://blockchain.info/rawaddr/${address}`);
    
    const data = response.data;
  
    const addressDetails = {
      address: data.address,
      balance: data.final_balance,
      totalTx: data.n_tx,
      transactions: data.txs.map(tx => ({
        hash: tx.hash,
        value: tx.result,
      })),
    };
  
    return addressDetails;
    
  } catch (error) {
    throwError(error.response.status, error.response.statusText, error.response.data.message);
  }
};

const bitcoinService = {
  getBitcoinAddressData,
};

export default bitcoinService;