import Express from "express";
import axios from "axios";
import BASE_URL from "./constants.js";

const app = Express();
const port = 3000;

app.get(`${BASE_URL}/accounts`, async (req, res) => {
    // const bearerToken = req.headers.authorization.split(" ")[1];

    // console.log(bearerToken);
    // res.send(bearerToken);

    const headerConfig = {
        headers: {
            Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHAiOiJkZW1vLWFwcC01NDMzYzg1OS04ZDBkLTRmOWItOTdkMS0zNTA4MTAyZDMwMjIiLCJvcmciOiI1NDMzYzg1OS04ZDBkLTRmOWItOTdkMS0zNTA4MTAyZDMwMjIuZXhhbXBsZS5vcmciLCJpc3MiOiJodHRwczovL2FwaS5zYW5kYm94Lm5hdHdlc3QuY29tIiwidG9rZW5fdHlwZSI6IkFDQ0VTU19UT0tFTiIsImV4dGVybmFsX2NsaWVudF9pZCI6ImVOckdLeUdNZW9YRmh6WlFOdnc3eWFxUC1oVlBWekJlUTVNZ2tKczBvZHc9IiwiY2xpZW50X2lkIjoiNzhmM2Q5MzItMGE1YS00M2MwLTg0YTMtMmRhMjNjZDliZDUyIiwibWF4X2FnZSI6ODY0MDAsImF1ZCI6Ijc4ZjNkOTMyLTBhNWEtNDNjMC04NGEzLTJkYTIzY2Q5YmQ1MiIsInVzZXJfaWQiOiIxMjM0NTY3ODkwMTJANTQzM2M4NTktOGQwZC00ZjliLTk3ZDEtMzUwODEwMmQzMDIyLmV4YW1wbGUub3JnIiwiZ3JhbnRfaWQiOiI0ZWFkZDIxNi00ZmFjLTQ0ODAtYmM0MS0zNmU5OGU5NmM2ZTciLCJzY29wZSI6ImFjY291bnRzIG9wZW5pZCIsImNvbnNlbnRfcmVmZXJlbmNlIjoiOTBlMTBhNzctYzJlOC00YWIyLTg0YzQtZGMzOTk1ZGQ5N2YzIiwiZXhwIjoxNjQ4NzYwNjg5LCJpYXQiOjE2NDg3NjAzODksImp0aSI6ImI0MmU4NTQyLWM2ZjgtNGUzMC04YTBkLWFjMzg5ODc1YzUzYyIsInRlbmFudCI6Ik5hdFdlc3QifQ.b-7sYOTZ4I6uhV2kNvVSpPNYblOBw-L364uEX0XZ8_6GXgSepy7Gi_tbgm1hQF3ipVWjm8VAiLVFSEm3Cdy79ghLGqp-9zDpRCWI_EYZqxk-ZT7yYIAtjUIzH6IfNKxFDgFW5ztTy0A2O0s06w9xFggUrxX_hJn8kqxU96lmTuOAdnNuzJkaHYNQNZMXRu1mTwi7UsNwwEeCKea4jW6kGlBAHl6IZdAsFUUgKCwQQ29eB9r1MRCMXFjh_RVby6ktpxIkMMx8GTXWpC4_LWRytpFvnvqAaOhS5SzZZGo8dT8G-x-db7Im5GRUeroQo_MhBgCh05mIMbpUw0fxk8fvYQ`,
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
            accountSubType: e.AccountSubType,
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

app.listen(port, () => console.log("Listening on Port " + port));
