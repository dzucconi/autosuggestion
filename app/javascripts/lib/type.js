import rand from './rand';
import decode from './decode';
import timeout from './timeout';

export default (el, message, range, fn = (x => x)) => {
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
