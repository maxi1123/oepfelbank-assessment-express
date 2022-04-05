const axios = require("axios");
const utils = require("../utils/auth-header.util");
const mathUtil = require("../utils/math.util");
const endpoints = require("../utils/endpoints.constants");

async function getAccounts(bearerToken) {
    const authHeader = utils.authHeader(bearerToken);

    const accountResponseArray = [];

    const accountResponse = await axios.get(
        `${endpoints.BASE_API_ENDPOINT}/open-banking/v3.1/aisp/accounts/`,
        authHeader
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
            `${endpoints.BASE_API_ENDPOINT}/open-banking/v3.1/aisp/accounts/${accountResponseArray[i].accountId}/balances`,
            authHeader
        );

        accountResponseArray[i].balance = mathUtil.round(
            balanceResponse.data.Data.Balance[0].Amount.Amount
        );
    }

    let totalValue = 0;
    accountResponseArray.forEach((account) => {
        totalValue += account.balance;
    });

    return {
        accounts: accountResponseArray,
        totalBalance: totalValue,
    };
}

async function getAccountById(bearerToken, id) {
    const authHeader = utils.authHeader(bearerToken);

    let selectedAccount = {};

    const accountResponse = await axios.get(
        `${endpoints.BASE_API_ENDPOINT}/open-banking/v3.1/aisp/accounts/`,
        authHeader
    );

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
        `${endpoints.BASE_API_ENDPOINT}/open-banking/v3.1/aisp/accounts/${id}/balances`,
        authHeader
    );

    const selectedAccountBalance = mathUtil.round(
        balanceResponse.data.Data.Balance[0].Amount.Amount
    );

    selectedAccount.balance = selectedAccountBalance;
    return selectedAccount;
}

module.exports = {
    getAccounts,
    getAccountById,
};
