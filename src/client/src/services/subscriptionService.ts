import axios from 'axios';

const subscriptionService = {
  createSession: async (priceId: string) => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/subscriptions/session`,
      {
        priceId,
      },
    );
    return data;
  },

  getPrices: async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/subscriptions/prices`,
    );
    console.log(data);
    return data.data;
  },
};

export default subscriptionService;
