const accounts = require("../services/accounts.service");

async function get(req, res) {
  try {
    const bearerToken = req.headers.authorization.split(" ")[1];
    res.json(await accounts.getAccounts(bearerToken));
  } catch (err) {
    console.error(`Error `, err.message);
  }
}

async function getWithId(req, res) {
  try {
    const bearerToken = req.headers.authorization.split(" ")[1];
    const id = req.params.id;
    res.json(await accounts.getAccountById(bearerToken, id));
  } catch (err) {
    if (err.response.status === 400) {
      res.status(400).send("We could not find any account with given ID.");
    }
  }
}

module.exports = {
  get,
  getWithId,
};
