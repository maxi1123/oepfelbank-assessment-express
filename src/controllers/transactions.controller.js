const transactions = require("../services/transactions.service");

async function getWithId(req, res) {
    try {
        const bearerToken = req.headers.authorization.split(" ")[1];
        const id = req.params.id;
        res.json(await transactions.getTransactionsById(bearerToken, id));
    } catch (err) {
        if (err.response.status === 400) {
            res.status(400).send(
                "We could not find any transactions for this account or you don't have access."
            );
        }
    }
}

async function getPending(req, res) {
    try {
        const bearerToken = req.headers.authorization.split(" ")[1];
        const id = req.params.id;
        res.json(
            await transactions.getPendingTransactionsById(bearerToken, id)
        );
    } catch (err) {
        if (err.response.status === 400) {
            res.status(400).send(
                "We could not find any transactions for this account or you don't have access."
            );
        }
    }
}

module.exports = {
    getWithId,
    getPending,
};
