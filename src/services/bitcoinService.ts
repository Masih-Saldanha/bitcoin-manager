import axios from "axios";

import { throwError } from "../utils/errorTypeUtils.js";

async function getBitcoinAddressData(address: string) {
  try {
    const response = await axios.get(`https://blockchain.info/rawaddr/${address}`);
    
    const data = response.data;

    let confirmed = 0;
    let unconfirmed = 0;

    const unspentOutputs = await axios.get(`https://blockchain.info/unspent?active=${address}`);

    const unspentOutputsData = unspentOutputs.data.unspent_outputs;

    for (const output of unspentOutputsData) {
      if (output.confirmations >= 2) {
        confirmed += output.value;
      } else if (output.confirmations < 2) {
        unconfirmed += output.value;
      }
    }
  
    const addressDetails = {
      address: data.address,
      balance: data.final_balance,
      totalTx: data.n_tx,
      balance_confirmed_unconfirmed: {
        confirmed, 
        unconfirmed,
      },
      total: {
        sent: data.total_sent,
        received: data.total_received,
      }
    };
  
    return addressDetails;
  } catch (error) {
    throwError(error.response.status, error.response.statusText, error.response.data.message);
  };
};

async function getBitcoinBalance(address: string) {
  try {
    let confirmed = 0;
    let unconfirmed = 0;

    const unspentOutputs = await axios.get(`https://blockchain.info/unspent?active=${address}`);

    const unspentOutputsData = unspentOutputs.data.unspent_outputs;

    for (const output of unspentOutputsData) {
      if (output.confirmations >= 2) {
        confirmed += output.value;
      } else if (output.confirmations < 2) {
        unconfirmed += output.value;
      }
    }

    const balanceDetails = {
      confirmed,
      unconfirmed,
    };

    return balanceDetails;
  } catch (error) {
    throwError(error.response.status, error.response.statusText, error.response.data.message);
  };
};

const bitcoinService = {
  getBitcoinAddressData,
  getBitcoinBalance,
};

export default bitcoinService;