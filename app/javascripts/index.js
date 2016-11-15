import axios from 'axios';
import parameters from 'queryparams';
import dom from './lib/dom';
import type from './lib/type';
import keyboard from './lib/keyboard';

window.parameters = parameters;

const CONFIG = {
  api: {
    base: 'http://localhost:5000',
    endpoint: '/words/search',
  },
};

const DOM = dom([
  'app',
  'input',
  'suggestions',
  'keyboard',
]);

export default () => {
  const { message, algorithm } = parameters({
    message: 'Maybe.',
    algorithm: 'soundex',
  });

  const fetch = token => {
    const url = `${CONFIG.api.base}${CONFIG.api.endpoint}?q=${token}&algorithm=${algorithm}&limit=3`;
    return axios.get(url);
  };

  type(DOM.input, message, aggregated => {
    const token = aggregated.split(' ').pop();

    if (token === '') return Promise.resolve(true);

    const match = token.match(/(\w+)/g);
    const stripped = match && match[0];

    DOM.keyboard.innerHTML = keyboard(stripped.substr(-1));

    return fetch(stripped).then(({ data }) => {
      DOM.keyboard.innerHTML = keyboard();

      const suggestions = `
        ${data.map(({ word }) => `
          <div class='suggestion'>
            ${word.toLowerCase()}
          </div>
        `).join('')}
      `;

      DOM.suggestions.innerHTML = suggestions;
    });
  });
};
