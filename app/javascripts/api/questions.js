import axios from 'axios';

const CONFIG = {
  base: 'http://questions.damonzucconi.com',
  endpoint: '/',
};

export const client = axios.create({
  baseURL: CONFIG.base,
  timeout: 15000,
  headers: {
    'Accepts': 'application/json',
  },
});

export const fetch = () => {
  return client
    .get(CONFIG.endpoint)
    .then(({ data }) =>
      data.map(question => question.text));
};
