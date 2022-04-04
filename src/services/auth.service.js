const axios = require("axios");
const endpoints = require("../utils/endpoints.constants");

async function initUIFlow() {
  CLIENT_ID = "eNrGKyGMeoXFhzZQNvw7yaqP-hVPVzBeQ5MgkJs0odw=";
  CLIENT_SECRET = "cE9QB0rkwKjrCp24s5N6P_ji66hfffJJmzsW4wrhsPs=";

  const formHeaders = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const body = new URLSearchParams();
  body.set("grant_type", "client_credentials");
  body.set("client_id", `${CLIENT_ID}`);
  body.set("client_secret", `${CLIENT_SECRET}`);
  body.set("scope", "accounts");

  const requestToken = await axios.post(
    `${endpoints.TOKEN_ENDPOINT}`,
    body.toString(),
    { headers: formHeaders }
  );

  const authHeaders = {
    Authorization: `Bearer ${requestToken.data.access_token}`,
  };

  const authBody = {
    Data: {
      Permissions: [
        "ReadAccountsDetail",
        "ReadBalances",
        "ReadTransactionsCredits",
        "ReadTransactionsDebits",
        "ReadTransactionsDetail",
        "ReadScheduledPaymentsBasic",
        "ReadScheduledPaymentsDetail",
        "ReadDirectDebits",
        "ReadInvestmentAccounts"
      ],
    },
    Risk: {},
  };

  const res = await axios.post(
    `${endpoints.BASE_API_ENDPOINT}/open-banking/v3.1/aisp/account-access-consents`,
    authBody,
    {
      headers: authHeaders,
    }
  );

  return res.data.Data.ConsentId;
}

async function exchangeToken(code) {
  CLIENT_ID = "eNrGKyGMeoXFhzZQNvw7yaqP-hVPVzBeQ5MgkJs0odw=";
  CLIENT_SECRET = "cE9QB0rkwKjrCp24s5N6P_ji66hfffJJmzsW4wrhsPs=";
  const formHeaders = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const body = new URLSearchParams();
  body.set("grant_type", "authorization_code");
  body.set("client_id", CLIENT_ID);
  body.set("client_secret", CLIENT_SECRET);
  body.set("code", code);
  body.set("redirect_uri", `${endpoints.REDIRECT_URI}`);

  const tokenResponse = await axios.post(
    `${endpoints.TOKEN_ENDPOINT}`,
    body.toString(),
    { headers: formHeaders }
  );

  return tokenResponse;
}

module.exports = {
  initUIFlow,
  exchangeToken,
};
