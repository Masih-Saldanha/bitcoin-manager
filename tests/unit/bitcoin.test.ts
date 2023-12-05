import axios from "axios";

import "../../src/config/dotenvConfig.js";
import bitcoinService from "../../src/services/bitcoinService.js";
import bitcoinFactory from "../factories/bitcoinFactory.js"

describe("Successful bitcoin unit tests", () => {
  it("Should return the expected structure on getBitcoinAddressData()", async () => {
    const mockedAddressData = bitcoinFactory.returnMockedAddressData();
    jest.spyOn(axios, 'get').mockImplementationOnce((): any => {
      return { data: mockedAddressData };
    });

    const expectedStructure = bitcoinFactory.expectedStructureAddressDetails;

    const response = await bitcoinService.getBitcoinAddressData(bitcoinFactory.validAddress);

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
    const mockedUtxos = bitcoinFactory.returnMockedUtxos();
    jest.spyOn(axios, 'get').mockImplementationOnce((): any => {
      return { data: mockedUtxos };
    });

    const expectedStructure = bitcoinFactory.expectedStructureAddressBalance;

    const response = await bitcoinService.getBitcoinBalance(bitcoinFactory.validAddress);

    expect(response).toMatchObject(expectedStructure);

    expect(response.confirmed).toEqual((parseInt(mockedUtxos[1].value) + parseInt(mockedUtxos[2].value)).toString());
    expect(response.unconfirmed).toEqual(mockedUtxos[0].value);
  });

  it("Should return the expected structure on utxoNeededToSendBitcoin()", async () => {
    const mockedUtxos = bitcoinFactory.returnMockedUtxos();
    jest.spyOn(axios, 'get').mockImplementationOnce((): any => {
      return { data: mockedUtxos };
    });

    const expectedStructure = bitcoinFactory.expectedStructureSendAddress;

    const response = await bitcoinService.utxoNeededToSendBitcoin(bitcoinFactory.validAddress, 1000);

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
    const mockedTx = bitcoinFactory.returnMockedTx();
    jest.spyOn(axios, 'get').mockImplementationOnce((): any => {
      return { data: mockedTx };
    });

    const expectedStructure = bitcoinFactory.expectedStructureTx;

    const response = await bitcoinService.getTransactionInfo(bitcoinFactory.validTx);

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
