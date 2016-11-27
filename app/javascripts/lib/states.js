export default message =>
  message
    .split('')
    .reduce((memo, char) => {
      const prev = memo[memo.length - 1];

      if (char === ' ' || prev === ' ') {
        memo.push(char);
        return memo;
      }

      memo.push(prev ? prev + char : char);

      return memo;
    }, []);
