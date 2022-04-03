const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.get("/", authController.get);
router.get("/token/:token", authController.getToken);

module.exports = router;
