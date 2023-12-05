import supertest from "supertest";

import app from "../../src/config/app.js";
import "../../src/config/dotenvConfig.js";

const validAddress = "bc1qyds5jrka5mfcltc7c27jmmxzuxzg6shjwfwca7";
const validTx = "3654d26660dcc05d4cfb25a1641a1e61f06dfeb38ee2279bdb049d018f1830ab";
const invalidData = "a";
const emptyString = "";

describe("Successful bitcoin integrations tests", () => {
  it("Should return the expected structure on /details/:address", async () => {
    const response = await supertest(app).get(`/details/${validAddress}`);

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

    expect(response.body).toMatchObject(expectedStructure);

    expect(response.body.address).toEqual(validAddress);
    expect(response.body.balance).toEqual(expect.any(String));
    expect(response.body.totalTx).toEqual(expect.any(String));
    expect(response.body.balance_confirmed_unconfirmed.confirmed).toEqual(expect.any(String));
    expect(response.body.balance_confirmed_unconfirmed.unconfirmed).toEqual(expect.any(String));
    expect(response.body.total.sent).toEqual(expect.any(String));
    expect(response.body.total.received).toEqual(expect.any(String));

    expect(response.statusCode).toBe(200);
  });

  it("Should return the expected structure on /balance/:address", async () => {
    const response = await supertest(app).get(`/balance/${validAddress}`);

    const expectedStructure = {
      confirmed: expect.any(String),
      unconfirmed: expect.any(String),
    };

    expect(response.body).toMatchObject(expectedStructure);

    expect(response.body.confirmed).toEqual(expect.any(String));
    expect(response.body.unconfirmed).toEqual(expect.any(String));

    expect(response.statusCode).toBe(200);
  });

  it("Should return the expected structure on /send", async () => {
    const requestBody = {
      address: validAddress,
      bitcoin: 1000,
    };

    const response = await supertest(app).post(`/send`).send(requestBody);

    const expectedStructure = {
      utxos: expect.any(Array),
    };

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
    const response = await supertest(app).get(`/tx/${validTx}`);

    const expectedStructure = {
      addresses: expect.any(Array),
      block: expect.any(Number),
      txID: expect.any(String),
    };

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
    const requestBody = {
      address: invalidData,
      bitcoin: 1000,
    };
    const response = await supertest(app).post(`/send/`).send(requestBody);

    expect(response.text).toBe("Invalid address");
    expect(response.statusCode).toBe(400);
  });

  it("Should return Joi verification errors on /send/", async () => {
    const requestBody = {
      address: emptyString,
      bitcoin: 0,
    };
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
});