const express = require('express');
const { getAllLicences } = require('../controllers/licencia_controller');
const router = express.Router();

router.get('/all', getAllLicences);

module.exports = router;