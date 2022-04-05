const round = (n) => {
  return Math.ceil(parseFloat(n) * 20 - 0.5) / 20;
};

module.exports = {
  round,
};
