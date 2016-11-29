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
  message: `We make a star
  as we make a constellation
  by putting its parts together
  and marking off its boundaries`,
  min: 0,
  max: 150,
});

const fetch = text => {
  const url = `${CONFIG.api.base}${CONFIG.api.endpoint}?text=${text}`;
  return axios.get(url);
};

const suggest = text =>
  fetch(states(text).join(' '))
    .then(({ data: [{ suggestions }] }) => [text, suggestions]);

export default () => {
  const play = promises =>
    promises.shift()
      // Playback
      .then(([text, suggestions]) => {
        DOM.indicator.parentNode.removeChild(DOM.indicator);

        return type(DOM.input, text, [min, max], aggregated => {
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
        });
      })

      // Reset
      .then(() => {
        if (promises.length) {
          DOM.app.appendChild(DOM.indicator);
          return play(promises);
        }
      });

  const lines = message.split('\n').map(x => x.trim());

  const init = () =>
    lines.reduce((promise, line) => {
      return promise.then(() => {
        return play([suggest(line)])
          .then(() => {
            DOM.app.appendChild(DOM.indicator);
          });
      });
    }, Promise.resolve(true))
      .then(() => {
        DOM.indicator.parentNode.removeChild(DOM.indicator);
        DOM.keyboard.innerHTML = keyboard();
      });

  init();
};
