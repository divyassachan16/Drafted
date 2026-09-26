const express = require("express");
const router = express.Router();
const authController = require("./../controllers/Auth.controller");
const requireAuth = require("./../middleware/auth.middleware");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

// protected route
router.post("/me", requireAuth, authController.me);

module.exports = router;
