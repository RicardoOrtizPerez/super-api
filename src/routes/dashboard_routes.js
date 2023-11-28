const express = require('express');
const { getContadorOptimizacionesPorDia, getContadorOptimizacionesPorDiayCliente, getOptimizaciones } = require('../controllers/dashboard_controller');
const router = express.Router();

router.post('/optimizaciones-por-dia-contador', getContadorOptimizacionesPorDia);
router.post('/optimizaciones-por-dia-clientes-contador', getContadorOptimizacionesPorDiayCliente);
router.post('/optimizaciones/obtener', getOptimizaciones);

module.exports = router;