export default keys => keys.reduce((memo, key) => {
  memo[key] = document.getElementById(key);
  return memo;
}, {});
