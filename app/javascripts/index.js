import axios from 'axios';
import parameters from 'queryparams';
import dom from './lib/dom';
import type from './lib/type';
import keyboard from './lib/keyboard';
import states from './lib/states';
import fill from './lib/fill';
import timeout from './lib/timeout';

window.parameters = parameters;

const CONFIG = {
  api: {
    base: 'http://api.corrasable.com',
    endpoint: '/phonetic/suggestions',
  },
};

const DOM = dom([
  'app',
  'indicator',
  'input',
  'suggestions',
  'keyboard',
]);

const { message, min, max } = parameters({
  message: 'We make a star as we make a constellation',
  min: 0,
  max: 250,
});

const fetch = text => {
  const url = `${CONFIG.api.base}${CONFIG.api.endpoint}?text=${text}`;
  return axios.get(url);
};

export default () => {
  fetch(states(message).join(' '))
    .then(({ data: [{ suggestions }]}) => {
      DOM.indicator.parentNode.removeChild(DOM.indicator);

      const playback = () =>
        type(DOM.input, message, [min, max], aggregated => {
          const token = aggregated.split(' ').pop();
          const match = token.match(/(\w+)/g);

          if (!match) return Promise.resolve(true);

          suggestions.push(suggestions.shift());

          const letter = match && match[0];
          const tokens = fill(suggestions[suggestions.length - 1], 3, '…');

          DOM.suggestions.innerHTML = `
            ${tokens.map(token => `
              <div class='suggestion'>
                ${token.toLowerCase()}
              </div>
            `).join('')}
          `;

          DOM.keyboard.innerHTML = keyboard(letter.substr(-1));

          return Promise.resolve(true);
        })

        // Pause
        .then(() => {
          DOM.keyboard.innerHTML = keyboard();

          return timeout(2500);
        })

        // Reset
        .then(() => {
          DOM.input.innerHTML = '';
          playback();
        });

      // Begin
      playback();
    });
};
