import axios from "axios";
import { validate } from 'bitcoin-address-validation';

import { throwError } from "../utils/errorTypeUtils.js";

function isValidTransactionId(txid: string) {
  const regex = /^[a-fA-F0-9]{64}$/;
  return regex.test(txid);
}

async function getBitcoinAddressData(address: string) {
  try {
    throwError(!validate(address), "Bad Request", "Invalid address");
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
    if (error.type) {
      throwError(true, error.type, error.message);
    } else {
      throwError(error.response.status, error.response.statusText, error.response.data.error);
    }
  };
};

async function getBitcoinBalance(address: string) {
  try {
    throwError(!validate(address), "Bad Request", "Invalid address");
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

    let confirmed = 0;
    let unconfirmed = 0;
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
    if (error.type) {
      throwError(true, error.type, error.message);
    } else {
      throwError(error.response.status, error.response.statusText, error.response.data.error);
    }
  };
};

async function utxoNeededToSendBitcoin(address: string, totalAmount: number) {
  try {
    throwError(!validate(address), "Bad Request", "Invalid address");
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

    let maxAmount = 0;
    data.forEach(utxo => {
      maxAmount += parseInt(utxo.value);
    });
    throwError(totalAmount > maxAmount, "Bad Request", "Insufficient amount of bitcoins");

    const orderedData = data.slice();
    orderedData.sort((a, b) => parseFloat(b.value) - parseFloat(a.value));

    let countAmout = 0;

    const utxoNeeded = []
    for (const utxo of orderedData) {
      if (
        countAmout < totalAmount &&
        totalAmount >= parseInt(utxo.value)
      ) {
        countAmout += parseInt(utxo.value);
        const utxoData = {
          txid: utxo.txid,
          amount: utxo.value,
        };
        utxoNeeded.push(utxoData);
        if (totalAmount < parseInt(utxo.value)) {
          break;
        }
      }
    }
    throwError(countAmout < totalAmount, "Bad Request", "Insufficient amount of utxo");

    const utxoList = { utxos: utxoNeeded }
    return utxoList;
  } catch (error) {
    if (error.type) {
      throwError(true, error.type, error.message);
    } else {
      throwError(error.response.status, error.response.statusText, error.response.data.error);
    }
  };
};

async function getTransactionInfo(txid: string) {
  try {
    throwError(!isValidTransactionId(txid), "Bad Request", "Invalid txid");
    const response = await axios.get(
      `${process.env.BITCOIN_URL}/tx/${txid}`,
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
    if (error.type) {
      throwError(true, error.type, error.message);
    } else {
      throwError(error.response.status, error.response.statusText, error.response.data.error);
    }
  };
};

const bitcoinService = {
  getBitcoinAddressData,
  getBitcoinBalance,
  utxoNeededToSendBitcoin,
  getTransactionInfo,
};

export default bitcoinService;