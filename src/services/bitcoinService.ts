import axios from "axios";

import { throwError } from "../utils/errorTypeUtils.js";

async function getBitcoinAddressData(address: string) {
  try {
    const response = await axios.get(
      `${process.env.BITCOIN_URL}/address/${address}`, 
      {
        auth: 
        {
          username: process.env.BITCOIN_USERNAME, 
          password: process.env.BITCOIN_PASSWORD 
        }
      }
    );

    const data = response.data;

    const addressDetails = {
      address: data.address,
      balance: data.balance,
      totalTx: data.txs.toString(),
      balance_confirmed_unconfirmed: {
        confirmed: data.balance,
        unconfirmed: data.unconfirmedBalance,
      },
      total: {
        sent: data.totalSent,
        received: data.totalReceived,
      }
    };

    return addressDetails;
  } catch (error) {
    throwError(error.response.status, error.response.statusText, error.response.data.error);
  };
};

async function getBitcoinBalance(address: string) {
  try {
    let confirmed = 0;
    let unconfirmed = 0;

    const unspentOutputs = await axios.get(
      `${process.env.BITCOIN_URL}/utxo/${address}`, 
      {
        auth: 
        {
          username: process.env.BITCOIN_USERNAME, 
          password: process.env.BITCOIN_PASSWORD 
        }
      }
    );

    const data = unspentOutputs.data;

    for (const tx of data) {
      if (tx.confirmations >= 2) {
        confirmed += parseInt(tx.value);
      } else if (tx.confirmations < 2) {
        unconfirmed += parseInt(tx.value);
      }
    }

    const balanceDetails = {
      confirmed: confirmed.toString(),
      unconfirmed: unconfirmed.toString(),
    };

    return balanceDetails;
  } catch (error) {
    throwError(error.response.status, error.response.statusText, error.response.data.error);
  };
};

async function getTransactionInfo(address: string) {
  try {
    const response = await axios.get(
      `${process.env.BITCOIN_URL}/tx/${address}`, 
      {
        auth: 
        {
          username: process.env.BITCOIN_USERNAME, 
          password: process.env.BITCOIN_PASSWORD 
        }
      }
    );

    const data = response.data;

    const addresses = [];
    const a = []

    data.vout.forEach((output) => {
      const addressObj = {
        address: output.addresses[0],
        value: parseInt(output.value),
      };
    
      addresses.push(addressObj);
    });

    const transactionDetails = {
      addresses,
      block: data.blockHeight,
      txID: data.txid,
    };

    return transactionDetails;
  } catch (error) {
    throwError(error.response.status, error.response.statusText, error.response.data.error);
  };
};

const bitcoinService = {
  getBitcoinAddressData,
  getBitcoinBalance,
  getTransactionInfo,
};

export default bitcoinService;