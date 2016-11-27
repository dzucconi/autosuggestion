import axios from 'axios';
import parameters from 'queryparams';
import dom from './lib/dom';
import type from './lib/type';
import keyboard from './lib/keyboard';

window.parameters = parameters;

const CONFIG = {
  api: {
    base: 'http://api.corrasable.com',
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

    const stripped = token.match(/(\w+)/g)[0];

    DOM.keyboard.innerHTML = keyboard(stripped.substr(-1));

    return fetch(stripped).then(({ data }) => {
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
