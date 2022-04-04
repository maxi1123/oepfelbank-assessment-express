const express = require("express");
const router = express.Router();
const transactionsController = require("../controllers/transactions.controller");

router.get("/:id", transactionsController.getWithId);
router.get("/:id/pending", transactionsController.getPending);

module.exports = router;
