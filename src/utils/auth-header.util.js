const authHeader = (bearerToken) => {
    return {
        headers: {
            Authorization: `Bearer ${bearerToken}`,
        },
    };
};

module.exports = {
    authHeader,
};
