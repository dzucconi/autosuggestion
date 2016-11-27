import rand from './rand';
import decode from './decode';

const range = [0, 250];

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

          const fetch = fn(aggregated.join(''));

          return fetch
            .then(() => {
              el && (el.innerHTML += `<span class='letter'>${letter}</span>`);
            })
            .then(() => timeout(rand(range[0], range[1])))
            .then(resolve);
        });
      });
    }, Promise.resolve(true));
};
