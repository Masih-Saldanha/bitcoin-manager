import { validate } from 'bitcoin-address-validation';

import { throwError } from "../utils/errorTypeUtils.js";
import isValidTxid from "../helpers/isValidTxid.js";
import returnAxiosRequisition from "../helpers/returnAxiosRequisition.js";

async function getBitcoinAddressData(address: string) {
  try {
    throwError(!validate(address), "Bad Request", "Invalid address");
    const response = await returnAxiosRequisition("address", address);
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
    const unspentOutputs = await returnAxiosRequisition("utxo", address);
    const data = unspentOutputs.data;

    let confirmed = BigInt(0);
    let unconfirmed = BigInt(0);
    for (const tx of data) {
      if (tx.confirmations >= 2) {
        confirmed += BigInt(tx.value);
      } else if (tx.confirmations < 2) {
        unconfirmed += BigInt(tx.value);
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
    const bigIntTotalAmount = BigInt(totalAmount);
    throwError(!validate(address), "Bad Request", "Invalid address");
    const unspentOutputs = await returnAxiosRequisition("utxo", address);;
    const data = unspentOutputs.data;

    let maxAmount = BigInt(0);
    data.forEach(utxo => {
      maxAmount += BigInt(utxo.value);
    });
    throwError(bigIntTotalAmount > maxAmount, "Bad Request", "Insufficient amount of bitcoins");

    data.sort((a, b) => parseFloat(b.value) - parseFloat(a.value));

    const utxoNeeded = []
    let countAmout = BigInt(0);
    for (const utxo of data) {
      if (
        countAmout < bigIntTotalAmount &&
        bigIntTotalAmount >= BigInt(utxo.value)
      ) {
        countAmout += BigInt(utxo.value);
        const utxoData = {
          txid: utxo.txid,
          amount: utxo.value,
        };
        utxoNeeded.push(utxoData);
        if (countAmout >= bigIntTotalAmount) {
          break;
        }
      }
    }
    throwError(countAmout < bigIntTotalAmount, "Bad Request", "Insufficient amount of utxo");

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
    throwError(!isValidTxid(txid), "Bad Request", "Invalid txid");
    const response = await returnAxiosRequisition("tx", txid);
    const data = response.data;

    const addresses = [];
    data.vout.forEach((output) => {
      const addressObj = {
        address: output.addresses[0],
        value: BigInt(output.value).toString(),
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