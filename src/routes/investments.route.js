const express = require("express");
const router = express.Router();
const investmentsController = require("../controllers/investments.controller");

router.get("/", investmentsController.get);

module.exports = router;
