import Express from "express";
import axios from "axios";
import BASE_URL from "./constants.js";

const app = Express();
const port = 3000;

app.get(`${BASE_URL}/accounts/:id`, async (req, res) => {
    const id = req.params.id;
    try {
        const bearerToken = req.headers.authorization.split(" ")[1];
        const headerConfig = {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
            },
        };

        const accountResponse = await axios.get(
            "https://ob.sandbox.natwest.com/open-banking/v3.1/aisp/accounts/",
            headerConfig
        );

        let selectedAccount = {};

        accountResponse.data.Data.Account.map((e) => {
            if (e.AccountId === id) {
                selectedAccount = {
                    accountId: e.AccountId,
                    accountSubType:
                        e.AccountSubType === "CurrentAccount"
                            ? "Current Account"
                            : e.AccountSubType,
                    currency: e.Currency,
                };
            }
        });

        const balanceResponse = await axios.get(
            `https://ob.sandbox.natwest.com/open-banking/v3.1/aisp/accounts/${id}/balances`,
            headerConfig
        );

        const selectedAccountBalance = (
            Math.ceil(
                parseFloat(balanceResponse.data.Data.Balance[0].Amount.Amount) *
                    20 -
                    0.5
            ) / 20
        ).toFixed(2);

        selectedAccount.balance = selectedAccountBalance;
        res.json(selectedAccount);
    } catch (error) {
        if (error.response.status === 400) {
            res.status(400).send(
                "We could not find any account with given ID."
            );
        }
    }
});

app.get(`${BASE_URL}/accounts`, async (req, res) => {
    const bearerToken = req.headers.authorization.split(" ")[1];

    const headerConfig = {
        headers: {
            Authorization: `Bearer ${bearerToken}`,
        },
    };

    const accountResponseArray = [];

    const accountResponse = await axios.get(
        "https://ob.sandbox.natwest.com/open-banking/v3.1/aisp/accounts/",
        headerConfig
    );

    accountResponse.data.Data.Account.map((e) => {
        accountResponseArray.push({
            accountId: e.AccountId,
            accountSubType:
                e.AccountSubType === "CurrentAccount"
                    ? "Current Account"
                    : e.AccountSubType,
            currency: e.Currency,
        });
    });

    for (let i = 0; i < accountResponseArray.length; i++) {
        const balanceResponse = await axios.get(
            `https://ob.sandbox.natwest.com/open-banking/v3.1/aisp/accounts/${accountResponseArray[i].accountId}/balances`,
            headerConfig
        );

        accountResponseArray[i].balance = (
            Math.ceil(
                parseFloat(balanceResponse.data.Data.Balance[0].Amount.Amount) *
                    20 -
                    0.5
            ) / 20
        ).toFixed(2);

        if (i === accountResponseArray.length - 1) {
            let totalValue = 0;
            accountResponseArray.forEach((account) => {
                totalValue += parseFloat(account.balance);
            });
            totalValue = totalValue.toFixed(2);
            res.json({
                accounts: accountResponseArray,
                totalBalance: totalValue,
            });
        }
    }
});

app.get(`${BASE_URL}/transactions/:id`, async (req, res) => {
    const id = req.params.id;

    try {
        const bearerToken = req.headers.authorization.split(" ")[1];
        const headerConfig = {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
            },
        };

        const transactionsResponse = await axios.get(
            `https://ob.sandbox.natwest.com/open-banking/v3.1/aisp/accounts/${id}/transactions`,
            headerConfig
        );

        const transactionsResponseArray = [];
        let total = 0;

        const getDate = (dateString) => {
            const date = new Date(dateString);
            const dd = String(date.getDate()).padStart(2, "0");
            const mm = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
            const yyyy = date.getFullYear();

            const transformed = `${dd}/${mm}/${yyyy}`;

            return transformed;
        };

        transactionsResponse.data.Data.Transaction.map((e) => {
            total += parseFloat(
                (
                    Math.ceil(parseFloat(e.Amount.Amount) * 20 - 0.5) / 20
                ).toFixed(2)
            );

            transactionsResponseArray.push({
                transactionId: e.TransactionId,
                transactionInfo: e.TransactionInformation,
                status: e.Status,
                bookingDate: getDate(e.BookingDateTime),
                amount: (
                    Math.ceil(parseFloat(e.Amount.Amount) * 20 - 0.5) / 20
                ).toFixed(2),
                currency: e.Amount.Currency,
            });
        });

        res.json({
            accountId: id,
            transactions: transactionsResponseArray,
            total: total.toFixed(2),
        });
    } catch (error) {
        if (error.response.status === 400) {
            res.status(400).send(
                "We could not find any transactions for this account or you don't have access."
            );
        }
    }
});

app.listen(port, () => console.log("Listening on Port " + port));
