import axios from 'axios';
import parameters from 'queryparams';
import dom from './lib/dom';
import type from './lib/type';
import keyboard from './lib/keyboard';

window.parameters = parameters;

const CONFIG = {
  api: {
    base: 'http://api.corrasable.com',
    endpoint: '/phonetic/suggestions',
  },
};

const DOM = dom([
  'app',
  'input',
  'suggestions',
  'keyboard',
]);

export default () => {
  return;

  const { message } = parameters({
    message: 'Maybe.',
  });

  const fetch = token => {
    const url = `${CONFIG.api.base}${CONFIG.api.endpoint}?text=${token}`;
    return axios.get(url);
  };

  type(DOM.input, message, aggregated => {
    const token = aggregated.split(' ').pop();
    const match = token.match(/(\w+)/g);

    DOM.keyboard.innerHTML = `
      <div class='key'>
        ${token.substr(-1) || 'space'}
      </div>
    `;

    if (!match) return Promise.resolve(true);

    const stripped = match && match[0];

    return fetch(stripped)
      .then(({ data }) => data[0][stripped])
      .then(tokens => {
        const suggestions = `
          ${tokens.map(token => `
            <div class='suggestion'>
              ${token.toLowerCase()}
            </div>
          `).join('')}
        `;

        DOM.suggestions.innerHTML = suggestions;
      });
  });
};
