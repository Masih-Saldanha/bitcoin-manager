import axios from "axios";

import "../../src/config/dotenvConfig.js";
import bitcoinService from "../../src/services/bitcoinService.js";

const validAddress = "bc1qyds5jrka5mfcltc7c27jmmxzuxzg6shjwfwca7";
const validTx = "3654d26660dcc05d4cfb25a1641a1e61f06dfeb38ee2279bdb049d018f1830ab";
const invalidData = "a";
const emptyString = "";
const mockedAddressData = {
  page: 1,
  totalPages: 1,
  itemsOnPage: 3,
  address: 'mock-address',
  balance: '1000',
  totalReceived: '1000',
  totalSent: '1000',
  unconfirmedBalance: '1000',
  unconfirmedTxs: 1,
  txs: 3,
  txids: [
    'mock-address1',
    'mock-address2',
    'mock-address3',
  ]
};
const mockedUtxos = [
  {
    txid: 'mock-txid1',
    vout: 0,
    value: '1000',
    confirmations: 1
  },
  {
    txid: 'mock-txid2',
    vout: 0,
    value: '600',
    confirmations: 2
  },
  {
    txid: 'mock-txid3',
    vout: 0,
    value: '300',
    confirmations: 3
  },
];
const mockedTx = {
  txid: '3654d26660dcc05d4cfb25a1641a1e61f06dfeb38ee2279bdb049d018f1830ab',
  version: 1,
  vin: [
    {
      txid: 'edbc73575a7d090332f929e8063eb824c47a3af4ce11b58734444cbb711acd6f',
      vout: 10,
      sequence: 4294967295,
      n: 0,
      addresses: ["mocked-address0"],
      isAddress: true,
      value: '484817655'
    }
  ],
  vout: [
    {
      value: '623579',
      n: 0,
      spent: true,
      hex: 'a914372289a51e522f686e202dd0fdda41be4be4167a87',
      addresses: ["mocked-address1"],
      isAddress: true
    },
    {
      value: '3283266',
      n: 1,
      spent: true,
      hex: '0014ca8a46c96e249bb4a4c8a81cb6d1c9709a664fa1',
      addresses: ["mocked-address2"],
      isAddress: true
    },
    {
      value: '90311',
      n: 2,
      spent: true,
      hex: '0014ecefccf4c71d713a28713a557f2bdbda11abee26',
      addresses: ["mocked-address3"],
      isAddress: true
    },
  ],
  blockHash: '00000000000000000007a42f774bdd29b2a8380ef0481c1bc4a01ee50d8ea79a',
  blockHeight: 1000,
  confirmations: 1000,
  blockTime: 1000,
  size: 1000,
  vsize: 1000,
  value: '1000',
  valueIn: '1000',
  fees: '1000',
  hex: 'mocked-hex'
};

describe("Successful bitcoin unit tests", () => {
  it("Should return the expected structure on getBitcoinAddressData()", async () => {
    jest.spyOn(axios, 'get').mockImplementationOnce((): any => {
      return { data: mockedAddressData };
    });

    const expectedStructure = {
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

    const response = await bitcoinService.getBitcoinAddressData(validAddress);

    expect(response).toMatchObject(expectedStructure);

    expect(response.address).toEqual(mockedAddressData.address);
    expect(response.balance).toEqual(mockedAddressData.balance);
    expect(response.totalTx).toEqual(mockedAddressData.txs.toString());
    expect(response.balance_confirmed_unconfirmed.confirmed).toEqual(mockedAddressData.balance);
    expect(response.balance_confirmed_unconfirmed.unconfirmed).toEqual(mockedAddressData.unconfirmedBalance);
    expect(response.total.sent).toEqual(mockedAddressData.totalSent);
    expect(response.total.received).toEqual(mockedAddressData.totalReceived);
  });

  it("Should return the expected structure on getBitcoinBalance()", async () => {
    jest.spyOn(axios, 'get').mockImplementationOnce((): any => {
      return { data: mockedUtxos };
    });

    const expectedStructure = {
      confirmed: expect.any(String),
      unconfirmed: expect.any(String),
    };

    const response = await bitcoinService.getBitcoinBalance(validAddress);

    expect(response).toMatchObject(expectedStructure);

    expect(response.confirmed).toEqual((parseInt(mockedUtxos[1].value) + parseInt(mockedUtxos[2].value)).toString());
    expect(response.unconfirmed).toEqual(mockedUtxos[0].value);
  });

  it("Should return the expected structure on utxoNeededToSendBitcoin()", async () => {
    jest.spyOn(axios, 'get').mockImplementationOnce((): any => {
      return { data: mockedUtxos };
    });

    const expectedStructure = {
      utxos: expect.any(Array),
    };

    const response = await bitcoinService.utxoNeededToSendBitcoin(validAddress, 1000);

    expect(response).toMatchObject(expectedStructure);

    response.utxos.forEach((utxo) => {
      const expectedAddressStructure = {
        txid: expect.any(String),
        amount: expect.any(String),
      };
      expect(utxo).toMatchObject(expectedAddressStructure);
    });
  });

  it("Should return the expected structure on getTransactionInfo()", async () => {
    jest.spyOn(axios, 'get').mockImplementationOnce((): any => {
      return { data: mockedTx };
    });

    const expectedStructure = {
      addresses: expect.any(Array),
      block: expect.any(Number),
      txID: expect.any(String),
    };

    const response = await bitcoinService.getTransactionInfo(validTx);

    expect(response).toMatchObject(expectedStructure);

    response.addresses.forEach((address) => {
      const expectedAddressStructure = {
        address: expect.any(String),
        value: expect.any(String),
      };
      expect(address).toMatchObject(expectedAddressStructure);
    });
    expect(response.block).toEqual(mockedTx.blockHeight);
    expect(response.txID).toEqual(mockedTx.txid);
  });
});
