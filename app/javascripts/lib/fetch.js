export default message => {
  const chars = message.split('');
  return chars
    .reduce((memo, char, i) => {
      let prev = memo[i - 1] || '';

      if (char === ' ') {
        prev = '';
      }

      // .match(/(\w+)/g)
      // const match = (prev + char;

      // const token = match && match[0];

      memo.push(token);

      return memo;
    }, []);
};
