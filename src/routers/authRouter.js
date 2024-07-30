"use strict";

const router = require("express").Router();
const {
  register,
  login,
  refresh,
  reset,
  forgot,
  verifyEmail,
  agreeContract,
  logout,
} = require("../controllers/authController");
const passport = require("passport");

// BASE_URL: /auth

router.post("/register", register);
router.post("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.get("/logout", logout);

router.post("/refresh", refresh);
router.post("/forgot", forgot);
router.post("/reset/:token", reset);

// Twitter authentication routes
router.get("/twitter", passport.authenticate("twitter"));
router.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    successRedirect: "http://localhost:3000/auth/success?provider=twitter",
    failureRedirect: "http://localhost:3000/auth/failure",
  })
);

// Google authentication routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: true,
    successRedirect: "http://localhost:3000/auth/success?provider=google",
    failureRedirect: "http://localhost:3000/auth/failure",
  })
);

// GitHub authentication routes
router.get("/github", passport.authenticate("github"));
router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "http://localhost:3000/auth/success?provider=github",
    failureRedirect: "http://localhost:3000/auth/failure",
  })
);

module.exports = router;
