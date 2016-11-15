const KEYBOARD = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

export default active => {
  return KEYBOARD.map(row => {
    return `
      <div class='keyboard__row'>
        ${row.map(key => `
          <span
            class='key ${key === active ? 'key--active' : ''}'
            data-key='${key}'>
              ${key === active ? `<span>${key}</span>` : ''}
          </span>
        `).join('')}
      </div>
    `;
  }).join('');
};
