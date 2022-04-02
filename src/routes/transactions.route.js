const express = require("express");
const router = express.Router();
const transactionsController = require("../controllers/transactions.controller");

router.get("/:id", transactionsController.getWithId);

module.exports = router;
