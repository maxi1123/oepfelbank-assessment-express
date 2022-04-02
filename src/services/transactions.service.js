const axios = require("axios");
const headerUtil = require("../utils/auth-header.util");
const dateUtil = require("../utils/date.util");
const mathUtil = require("../utils/math.util");

async function getTransactionsById(bearerToken, id) {
    const authHeader = headerUtil.authHeader(bearerToken);

    const transactionsResponseArray = [];
    let total = 0;

    const transactionsResponse = await axios.get(
        `https://ob.sandbox.natwest.com/open-banking/v3.1/aisp/accounts/${id}/transactions`,
        authHeader
    );

    transactionsResponse.data.Data.Transaction.map((e) => {
        total += -parseFloat(
            (Math.ceil(parseFloat(e.Amount.Amount) * 20 - 0.5) / 20).toFixed(2)
        );

        transactionsResponseArray.push({
            transactionId: e.TransactionId,
            transactionInfo: e.TransactionInformation,
            status: e.Status,
            bookingDate: dateUtil.dateTransform(e.BookingDateTime),
            amount: -mathUtil.roundAndFix(e.Amount.Amount),
            currency: e.Amount.Currency,
        });
    });

    return {
        accountId: id,
        transactions: transactionsResponseArray,
        total: total.toFixed(2),
    };
}

module.exports = {
    getTransactionsById,
};
