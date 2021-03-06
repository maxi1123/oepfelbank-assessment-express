const axios = require("axios");
const headerUtil = require("../utils/auth-header.util");
const dateUtil = require("../utils/date.util");
const mathUtil = require("../utils/math.util");
const endpoints = require("../utils/endpoints.constants");

async function getTransactionsById(bearerToken, id) {
    const authHeader = headerUtil.authHeader(bearerToken);

    const transactionsResponseArray = [];
    let total = 0;

    const transactionsResponse = await axios.get(
        `${endpoints.BASE_API_ENDPOINT}/open-banking/v3.1/aisp/accounts/${id}/transactions`,
        authHeader
    );

    if (transactionsResponse.data.Data.Transaction.length == 0) {
        return {
            accountId: "",
            transactions: [],
            total: 0,
        };
    }

    // Push some fake Data (will appear in savings & currents account as credit)

    total += 225.0;

    transactionsResponseArray.push({
        transactionId: "123123",
        transactionInfo: "Salärzahlung",
        status: "Booked",
        bookingDate: "02/25/2022",
        amount: 225.0,
        currency: "GBP",
    });

    transactionsResponse.data.Data.Transaction.map((e) => {
        let amount;

        if (e.CreditDebitIndicator === "Debit") {
            amount = -mathUtil.round(e.Amount.Amount);
            total += amount;
        } else {
            amount = mathUtil.round(e.Amount.Amount);
            total += amount;
        }

        transactionsResponseArray.push({
            transactionId: e.TransactionId,
            transactionInfo: e.TransactionInformation,
            status: e.Status,
            bookingDate: dateUtil.dateTransform(e.BookingDateTime),
            amount: amount,
            currency: e.Amount.Currency,
        });
    });

    return {
        accountId: id,
        transactions: transactionsResponseArray,
        total: total,
    };
}

async function getPendingTransactionsById(bearerToken, id) {
    const authHeader = headerUtil.authHeader(bearerToken);

    const pendingResponseArray = [];
    let total = 0;

    const pendingResponse = await axios.get(
        `${endpoints.BASE_API_ENDPOINT}/open-banking/v3.1/aisp/accounts/${id}/scheduled-payments`,
        authHeader
    );

    if (pendingResponse.data.Data.ScheduledPayment.length == 0) {
        return {
            accountId: "",
            transactions: [],
            total: 0,
        };
    }

    pendingResponse.data.Data.ScheduledPayment.map((e) => {
        const amount = -mathUtil.round(e.InstructedAmount.Amount);
        total += amount;

        pendingResponseArray.push({
            schedDateTime: dateUtil.dateTransform(e.ScheduledPaymentDateTime),
            amount: amount,
            currency: e.InstructedAmount.Currency,
            creditorAccount: e.CreditorAccount.Identification,
        });
    });

    return {
        accountId: id,
        transactions: pendingResponseArray,
        total: total,
    };
}

module.exports = {
    getTransactionsById,
    getPendingTransactionsById,
};
