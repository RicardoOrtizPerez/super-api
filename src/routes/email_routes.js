const express = require('express');
const { testEmail } = require('../controllers/email_controller');
const router = express.Router();

router.post('/test', testEmail);

module.exports = router;