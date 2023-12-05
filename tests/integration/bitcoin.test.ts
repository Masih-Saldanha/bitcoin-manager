import supertest from "supertest";
import axios from "axios";

import app from "../../src/config/app.js";
import "../../src/config/dotenvConfig.js";
import { throwError } from "../../src/utils/errorTypeUtils.js";
import bitcoinFactory from "../factories/bitcoinFactory.js"

const invalidData = "a";
const emptyString = "";
const badRequest = "Bad Request";

describe("Successful bitcoin integrations tests", () => {
  it("Should return the expected structure on /details/:address", async () => {
    const response = await supertest(app).get(`/details/${bitcoinFactory.validAddress}`);

    const expectedStructure = bitcoinFactory.expectedStructureAddressDetails;

    expect(response.body).toMatchObject(expectedStructure);

    expect(response.body.address).toEqual(bitcoinFactory.validAddress);
    expect(response.body.balance).toEqual(expect.any(String));
    expect(response.body.totalTx).toEqual(expect.any(String));
    expect(response.body.balance_confirmed_unconfirmed.confirmed).toEqual(expect.any(String));
    expect(response.body.balance_confirmed_unconfirmed.unconfirmed).toEqual(expect.any(String));
    expect(response.body.total.sent).toEqual(expect.any(String));
    expect(response.body.total.received).toEqual(expect.any(String));

    expect(response.statusCode).toBe(200);
  });

  it("Should return the expected structure on /balance/:address", async () => {
    const response = await supertest(app).get(`/balance/${bitcoinFactory.validAddress}`);

    const expectedStructure = bitcoinFactory.expectedStructureAddressBalance;

    expect(response.body).toMatchObject(expectedStructure);

    expect(response.body.confirmed).toEqual(expect.any(String));
    expect(response.body.unconfirmed).toEqual(expect.any(String));

    expect(response.statusCode).toBe(200);
  });

  it("Should return the expected structure on /send", async () => {
    const requestBody = bitcoinFactory.returnRequestBody(bitcoinFactory.validAddress, 1000);

    const response = await supertest(app).post(`/send`).send(requestBody);

    const expectedStructure = bitcoinFactory.expectedStructureSendAddress;

    expect(response.body).toMatchObject(expectedStructure);

    response.body.utxos.forEach((utxo) => {
      const expectedAddressStructure = {
        txid: expect.any(String),
        amount: expect.any(String),
      };
      expect(utxo).toMatchObject(expectedAddressStructure);
    });

    expect(response.statusCode).toBe(200);
  });

  it("Should return the expected structure on /tx/:tx", async () => {
    const response = await supertest(app).get(`/tx/${bitcoinFactory.validTx}`);

    const expectedStructure = bitcoinFactory.expectedStructureTx;

    expect(response.body).toMatchObject(expectedStructure);

    response.body.addresses.forEach((address) => {
      const expectedAddressStructure = {
        address: expect.any(String),
        value: expect.any(String),
      };
      expect(address).toMatchObject(expectedAddressStructure);
    });
    expect(response.body.block).toEqual(expect.any(Number));
    expect(response.body.txID).toEqual(expect.any(String));

    expect(response.statusCode).toBe(200);
  });
});

describe("Fail bitcoin integrations tests", () => {
  it("Should return 'Invalid address' on /details/a", async () => {
    const response = await supertest(app).get(`/details/${invalidData}`);

    expect(response.text).toBe("Invalid address");
    expect(response.statusCode).toBe(400);
  });

  it("Should return 'Invalid address' on /balance/a", async () => {
    const response = await supertest(app).get(`/balance/${invalidData}`);

    expect(response.text).toBe("Invalid address");
    expect(response.statusCode).toBe(400);
  });

  it("Should return 'Invalid address' on /send/", async () => {
    const requestBody = bitcoinFactory.returnRequestBody(invalidData, 1000);

    const response = await supertest(app).post(`/send/`).send(requestBody);

    expect(response.text).toBe("Invalid address");
    expect(response.statusCode).toBe(400);
  });

  it("Should return Joi verification errors on /send/", async () => {
    const requestBody = bitcoinFactory.returnRequestBody(emptyString, 0);

    const response = await supertest(app).post(`/send/`).send(requestBody);

    expect(response.body).toEqual([
      "\"address\" is not allowed to be empty",
      "\"bitcoin\" must be greater than or equal to 1"
    ]);
    expect(response.statusCode).toBe(406);
  });

  it("Should return 'Invalid address' on /tx/a", async () => {
    const response = await supertest(app).get(`/tx/${invalidData}`);

    expect(response.text).toBe("Invalid txid");
    expect(response.statusCode).toBe(400);
  });

  it("Should throw 'Invalid address' on /details/:address", async () => {
    const message = "Invalid address";
    jest.spyOn(axios, 'get').mockImplementationOnce((): any => {
      throw bitcoinFactory.returnError(400, badRequest, message);
    });

    const response = await supertest(app).get(`/details/${bitcoinFactory.validAddress}`);

    expect(response.text).toBe(message);
    expect(response.statusCode).toBe(400);
  });

  it("Should throw 'Invalid address' on /balance/:address", async () => {
    const message = "Invalid address";
    jest.spyOn(axios, 'get').mockImplementationOnce((): any => {
      throw bitcoinFactory.returnError(400, badRequest, message);
    });

    const response = await supertest(app).get(`/balance/${bitcoinFactory.validAddress}`);

    expect(response.text).toBe(message);
    expect(response.statusCode).toBe(400);
  });

  it("Should throw 'Invalid address' on /send", async () => {
    const message = "Invalid address";
    jest.spyOn(axios, 'get').mockImplementationOnce((): any => {
      throw bitcoinFactory.returnError(400, badRequest, message);
    });

    const requestBody = bitcoinFactory.returnRequestBody(bitcoinFactory.validAddress, 1000);

    const response = await supertest(app).post(`/send/`).send(requestBody);

    expect(response.text).toBe(message);
    expect(response.statusCode).toBe(400);
  });

  it("Should throw 'Invalid txid' on /tx/:tx", async () => {
    const message = "Invalid txid";
    jest.spyOn(axios, 'get').mockImplementationOnce((): any => {
      throw bitcoinFactory.returnError(400, badRequest, message);
    });

    const response = await supertest(app).get(`/tx/${bitcoinFactory.validTx}`);

    expect(response.text).toBe(message);
    expect(response.statusCode).toBe(400);
  });

  it("Should throw 'Internal Server Error' on /details/:address", async () => {
    jest.spyOn(axios, 'get').mockImplementationOnce((): any => {
      throwError(true, "", "");
    });

    const response = await supertest(app).get(`/details/${bitcoinFactory.validAddress}`);

    expect(response.text).toBe("Internal Server Error");
    expect(response.statusCode).toBe(500);
  });
});