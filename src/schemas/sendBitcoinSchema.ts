import Joi from "joi";

export type SendBitcoinData = {
  address: string;
  bitcoin: number;
};

const sendBitcoinData = Joi.object<SendBitcoinData>({
  address: Joi.string().min(1).required(),
  bitcoin: Joi.number().min(1).integer().required(),
});

const sendBitcoinSchema = {
  sendBitcoinData,
};

export default sendBitcoinSchema;