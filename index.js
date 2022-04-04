const express = require("express");
const app = express();
app.disable("x-powered-by");

const port = 3000;
const accountsRouter = require("./src/routes/accounts.route");
const transactionsRouter = require("./src/routes/transactions.route");
const authRouter = require("./src/routes/auth.route");
const investmentsRouter = require("./src/routes/investments.route");

const BASE_URL = "/api/v1";

app.get(`${BASE_URL}/`, (_req, res) => {
    res.json({ message: "ok" });
});

app.use(`${BASE_URL}/accounts`, accountsRouter);
app.use(`${BASE_URL}/transactions`, transactionsRouter);
app.use(`${BASE_URL}/auth`, authRouter);
app.use(`${BASE_URL}/investments`, investmentsRouter);

app.listen(port, () => console.log("Listening on Port " + port));
