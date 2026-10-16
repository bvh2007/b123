const express = require('express');

module.exports = function authRoutes(authController) {
  const router = express.Router();
  router.post('/register', authController.register);
  router.post('/login', authController.login);
  return router;
};
