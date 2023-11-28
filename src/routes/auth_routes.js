const express = require('express');
const authController = require('../controllers/auth_controller');
const verificarToken = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.registrarUsuario);
router.post('/logout',verificarToken, authController.logout);

module.exports = router;