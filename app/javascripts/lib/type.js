import rand from './rand';
import decode from './decode';

const range = [0, 0];

const timeout = ms =>
  new Promise(resolve => setTimeout(resolve, ms));

export default (el, message, fn = (x => x)) => {
  const letters = decode(message).split('')
    .concat([' ', ' ', ' ']);

  const aggregated = [];

  return letters
    .reduce((promise, letter) => {
      return promise.then(() => {
        return new Promise(resolve => {
          aggregated.push(letter);

          el && (el.innerHTML += `<span class='letter'>${letter}</span>`);

          const fetch = fn(aggregated.join(''));

          return fetch
            .then(() => timeout(rand(range[0], range[1])))
            .then(resolve);
        });
      });
    }, Promise.resolve(true));
};
