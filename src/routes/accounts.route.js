const express = require("express");
const router = express.Router();
const accountsController = require("../controllers/accounts.controller");

router.get("/", accountsController.get);

router.get("/:id", accountsController.getWithId);

module.exports = router;
