const roundAndFix = (n) => {
    return (Math.ceil(parseFloat(n) * 20 - 0.5) / 20).toFixed(2);
};

module.exports = {
    roundAndFix,
};
