import axios from 'axios';
import parameters from 'queryparams';
import dom from './lib/dom';
import type from './lib/type';
import keyboard from './lib/keyboard';
import states from './lib/states';

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
  const { message } = parameters({
    message: 'Maybe.',
  });

  const fetch = text => {
    const url = `${CONFIG.api.base}${CONFIG.api.endpoint}?text=${text}`;
    return axios.get(url);
  };

  fetch(states(message).join(' '))
    .then(({ data: [{ suggestions }]}) => {
      // console.log(suggestions);

      const playback = () =>
        type(DOM.input, message, aggregated => {
          const token = aggregated.split(' ').pop();
          const match = token.match(/(\w+)/g);

          if (!match) return Promise.resolve(true);

          suggestions.push(suggestions.shift());

          const letter = match && match[0];
          const tokens = suggestions[suggestions.length - 1];

          // console.log(letter, tokens);

          DOM.suggestions.innerHTML = `
            ${tokens.map(token => `
              <div class='suggestion'>
                ${token.toLowerCase()}
              </div>
            `).join('')}
          `;

          DOM.keyboard.innerHTML = keyboard(letter.substr(-1));

          return Promise.resolve(true);
        }).then(() => {
          DOM.input.innerHTML = '';

          playback();
        });

      playback();
    });
};
