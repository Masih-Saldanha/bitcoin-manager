import axios from "axios";

export default function returnAxiosRequisition(type: string, arg: string) {
  return axios.get(
    `${process.env.BITCOIN_URL}/${type}/${arg}`,
    {
      auth:
      {
        username: process.env.BITCOIN_USERNAME,
        password: process.env.BITCOIN_PASSWORD
      }
    }
  );
};