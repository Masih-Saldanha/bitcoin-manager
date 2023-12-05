import { faker } from '@faker-js/faker'

const validAddress = "bc1qyds5jrka5mfcltc7c27jmmxzuxzg6shjwfwca7";
const validTx = "3654d26660dcc05d4cfb25a1641a1e61f06dfeb38ee2279bdb049d018f1830ab";

const expectedStructureAddressDetails = {
  address: expect.any(String),
  balance: expect.any(String),
  totalTx: expect.any(String),
  balance_confirmed_unconfirmed: {
    confirmed: expect.any(String),
    unconfirmed: expect.any(String),
  },
  total: {
    sent: expect.any(String),
    received: expect.any(String),
  },
};

const expectedStructureAddressBalance = {
  confirmed: expect.any(String),
  unconfirmed: expect.any(String),
};

const expectedStructureSendAddress = {
  utxos: expect.any(Array),
};

const expectedStructureTx = {
  addresses: expect.any(Array),
  block: expect.any(Number),
  txID: expect.any(String),
};

function returnError(status: number, statusText: string, error: string) {
  return {
    response: {
      status,
      statusText,
      data: { error }
    }
  }
};

function returnRequestBody(address: string, bitcoin: number) {
  return {
    address,
    bitcoin,
  };
};

function returnMockedAddressData() {
  return {
    page: faker.number.int(10),
    totalPages: faker.number.int(10),
    itemsOnPage: faker.number.int(10),
    address: faker.string.alphanumeric(42),
    balance: faker.string.numeric(5),
    totalReceived: faker.string.numeric(5),
    totalSent: faker.string.numeric(5),
    unconfirmedBalance: faker.string.numeric(5),
    unconfirmedTxs: faker.number.int(10),
    txs: faker.number.int(10),
    txids: [
      faker.string.alphanumeric(64),
      faker.string.alphanumeric(64),
      faker.string.alphanumeric(64),
    ]
  }
};

function returnMockedUtxos() {
  return [
    {
      txid: faker.string.alphanumeric(64),
      vout: 0,
      value: '1000',
      confirmations: 1
    },
    {
      txid: faker.string.alphanumeric(64),
      vout: 0,
      value: '600',
      confirmations: 2
    },
    {
      txid: faker.string.alphanumeric(64),
      vout: 0,
      value: '300',
      confirmations: 3
    },
  ]
};

function returnMockedTx() {
  return {
    txid: faker.string.alphanumeric(64),
    version: faker.number.int(10),
    vin: [
      {
        txid: faker.string.alphanumeric(64),
        vout: faker.number.int(10),
        sequence: faker.number.int(1000000000),
        n: 0,
        addresses: [faker.string.alphanumeric(42)],
        isAddress: true,
        value: faker.string.numeric(9)
      }
    ],
    vout: [
      {
        value: faker.string.numeric(9),
        n: 0,
        spent: true,
        hex: faker.string.alphanumeric(46),
        addresses: [faker.string.alphanumeric(42)],
        isAddress: true
      },
      {
        value: faker.string.numeric(9),
        n: 1,
        spent: true,
        hex: faker.string.alphanumeric(46),
        addresses: [faker.string.alphanumeric(42)],
        isAddress: true
      },
      {
        value: faker.string.numeric(9),
        n: 2,
        spent: true,
        hex: faker.string.alphanumeric(46),
        addresses: [faker.string.alphanumeric(42)],
        isAddress: true
      },
    ],
    blockHash: faker.string.alphanumeric(64),
    blockHeight: faker.number.int(1000),
    confirmations: faker.number.int(1000),
    blockTime: faker.number.int(1000),
    size: faker.number.int(1000),
    vsize: faker.number.int(1000),
    value: faker.string.numeric(4),
    valueIn: faker.string.numeric(4),
    fees: faker.string.numeric(4),
    hex: faker.string.alphanumeric(10)
  };
};

const bitcoinFactory = {
  validAddress,
  validTx,
  expectedStructureAddressDetails,
  expectedStructureAddressBalance,
  expectedStructureSendAddress,
  expectedStructureTx,
  returnError,
  returnRequestBody,
  returnMockedAddressData,
  returnMockedUtxos,
  returnMockedTx,
};

export default bitcoinFactory;