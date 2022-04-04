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

    return {
        accounts: investmentsResponseArray,
        total: total.toFixed(2),
    };
}

module.exports = {
    getInvestmentAccounts,
};