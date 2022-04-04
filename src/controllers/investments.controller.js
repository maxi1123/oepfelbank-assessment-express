const investments = require("../services/investments.service");

async function get(req, res) {
    try {
        const bearerToken = req.headers.authorization.split(" ")[1];
        res.json(await investments.getInvestmentAccounts(bearerToken));
    } catch (err) {
        if (err.response.status === 400 || err.response.status === 401) {
            res.status(400).send(
                "We could not find any investments for this account or you don't have access."
            );
        }
    }
}

module.exports = {
    get,
};
