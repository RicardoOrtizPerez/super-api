const express = require('express');
const { getAllClientes, registrarCliente, getClientePorEmpresa, bajaDeCliente } = require('../controllers/cliente_controller');
const router = express.Router();

router.get('/get-all', getAllClientes);
router.post('/get-by-empresa', getClientePorEmpresa);
router.post('/baja-cliente', bajaDeCliente);
router.post('/registrar', registrarCliente);

module.exports = router;