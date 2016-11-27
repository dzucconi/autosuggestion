export default message =>
  message
    .split('')
    .reduce((memo, char) => {
      const prev = memo[memo.length - 1];
      memo.push(prev ? prev + char : char);
      return memo;
    }, []);
