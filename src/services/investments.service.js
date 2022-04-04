const axios = require("axios");
const headerUtil = require("../utils/auth-header.util");
const dateUtil = require("../utils/date.util");
const mathUtil = require("../utils/math.util");
const endpoints = require("../utils/endpoints.constants");

async function getInvestmentAccounts(bearerToken) {
    const authHeader = headerUtil.authHeader(bearerToken);

    let total = 0;

    const investmentsResponseArray = [];

    const investmentsResponse = await axios.get(
        `${endpoints.BASE_API_ENDPOINT}/open-banking/v3.1/aisp/accounts/investment-accounts`,
        authHeader
    );

    if (investmentsResponse.data.accounts.length == 0) {
        return {
            accounts: [],
        };
    }

    investmentsResponse.data.accounts.map((e) => {
        total += parseFloat(mathUtil.roundAndFix(e.balance));

        investmentsResponseArray.push({
            accountId: e.accountId,
            balance: mathUtil.roundAndFix(e.balance),
            holdings: e.holdings,
            transactions: e.transactions,
        });
    });

    // Push some fake data for a more saturated view

    investmentsResponse.data.accounts.map((e) => {
        total += 32583.35;

        investmentsResponseArray.push({
            accountId: "82da82b2-6770-b17f-1990-e9759e7f9fd2",
            balance: "32583.35",
            holdings: [...e.holdings, ...e.holdings, ...e.holdings],
            transactions: e.transactions,
        });
    });

    return {
        accounts: investmentsResponseArray,
        total: total.toFixed(2),
    };
}

module.exports = {
    getInvestmentAccounts,
};
