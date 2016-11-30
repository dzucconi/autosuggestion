import axios from 'axios';
import parameters from 'queryparams';
import { knuthShuffle as shuffle } from 'knuth-shuffle';
import dom from './lib/dom';
import type from './lib/type';
import keyboard from './lib/keyboard';
import states from './lib/states';
import fill from './lib/fill';

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
  min: 50,
  max: 250,
});

const fetch = text =>
  axios.get(`${CONFIG.api.base}${CONFIG.api.endpoint}?text=${text}`);

const suggest = text =>
  fetch(states(text).join(' '))
    .then(({ data: [{ suggestions }] }) => [text, suggestions]);

export default () => {
  const play = promises =>
    promises.shift()

      // Playback
      .then(([text, suggestions]) => {
        DOM.input.innerHTML = ' ';
        DOM.indicator.parentNode.removeChild(DOM.indicator);

        return type(DOM.input, text, [min, max], aggregated => {
          const token = aggregated.split(' ').pop();
          const last = token.substr(-1);

          let tokens = [];

          if (last.match(/[a-z]/i)) {
            suggestions.push(suggestions.shift());
            tokens = fill(suggestions[suggestions.length - 1], 3, '…');
            DOM.keyboard.innerHTML = keyboard(last);
          } else {
            tokens = fill([], 3, '…');
            DOM.keyboard.innerHTML = keyboard();
          }

          DOM.suggestions.innerHTML = `
            ${tokens.map(token => `
              <div class='suggestion'>
                ${token.toLowerCase()}
              </div>
            `).join('')}
          `;

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

  const init = lines =>
    lines.reduce((promise, line) => {
      return promise.then(() => {
        return play([suggest(line)])
          .then(() => {
            DOM.app.appendChild(DOM.indicator);
            DOM.keyboard.innerHTML = keyboard();
          });
      });
    }, Promise.resolve(true))
      .then(() => {
        DOM.indicator.parentNode.removeChild(DOM.indicator);
        DOM.keyboard.innerHTML = keyboard();
      });

  const promise = message
    ? Promise.resolve({ data: [{ text: message }] })
    : axios.get('http://questions.damonzucconi.com/', {
      headers: { 'Accepts': 'application/json' }
    });

  promise
    .then(({ data }) => {
      init(shuffle(data).map(question => question.text));
    });
};
