export default function isValidTxid(txid: string) {
  const regex = /^[a-fA-F0-9]{64}$/;
  return regex.test(txid);
};