const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { registerValidator, loginValidator } = require('../validators/auth.validator');
const { validate } = require('../middleware/validate.middleware');

const router = express.Router();

// POST /api/auth/register
router.post('/register', registerValidator, validate, AuthController.register);

// POST /api/auth/login
router.post('/login', loginValidator, validate, AuthController.login);

// GET /api/auth/logout
router.get('/logout', AuthController.logout);

module.exports = router;
