import axios from "axios";

export const getCards = async (brandId: number) => {
  return await axios.get(`/api/card/${brandId}`);
};

export const createPaymentLink = async (
  amount: number,
  email: string,
  cardId: number
) => {
  return await axios.post(`/api/payment`, {
    amount,
    email,
    cardId,
  });
};
