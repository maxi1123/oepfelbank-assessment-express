const auth = require("../services/auth.service");

async function get(_req, res) {
    try {
        res.json(await auth.initUIFlow());
    } catch (err) {
        console.error(`Error `, err);
    }
}

async function getToken(req, res) {
    try {
        const code = req.params.token;
        res.json(await auth.exchangeToken(code));
    } catch (err) {
        console.error(`Error `, err);
    }
}

module.exports = {
    get,
    getToken,
};
