import axios from 'axios';
import states from '../lib/states';

const CONFIG = {
  base: 'http://api.corrasable.com',
  endpoint: '/phonetic/suggestions',
};

export const client = axios.create({
  baseURL: CONFIG.base,
  timeout: 15000,
});

export const fetch = text => {
  const state = states(text).join(' ');

  return client
    .get(CONFIG.endpoint, { params: { text: state } })
    .then(({ data: [{ suggestions }] }) =>
      [text, suggestions]);
};
