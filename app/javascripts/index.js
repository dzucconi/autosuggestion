import axios from 'axios';
import parameters from 'queryparams';

window.parameters = parameters;

const DOM = {
  app: document.getElementById('app'),
};

export default () => {
  const { message } = parameters({
    message: 'Hello world. How are you doing today?',
  });

  const tokens = message.match(/(\w+)/g);

  tokens.reduce((promise, token) => {
    return promise.then(() => {
      return axios.get(`http://api.corrasable.com/words/search?q=${token}&algorithm=nysiis`)
        .then(({ data }) => {
          DOM.app.innerHTML += `
            <div>
              <strong>${token}</strong>: ${data.slice(0, 3).map(({ word }) => word.toLowerCase()).join(', ')}
            </div>
          `;
        });
    });
  }, Promise.resolve(true));
};
