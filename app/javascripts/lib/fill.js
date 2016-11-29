export default (xs, upto, fillwith) => {
  while (xs.length < upto) xs.push(fillwith);
  return xs;
};
