const express = require('express');
const { fulfillment, optimize, result, simulation, status, stop, toursResult, updateClients, addClients, addOrdersToOperationalPlanning } = require('../controllers/toursolver_controller');
const { rateLimitMiddleware, registrarSolicitudMiddleware } = require('../middlewares/rateLimitMiddleware');
const router = express.Router();


router.get('/fulfillment', fulfillment);
router.get('/result', result);
router.get('/simulation', simulation);
router.get('/status', status);
router.get('/toursResult', toursResult);

router.put('/updateClients', updateClients);

router.post('/stop', stop);
router.post('/addClients', addClients);
router.post('/addOrdersToOperationalPlanning', addOrdersToOperationalPlanning);
router.post('/optimize', rateLimitMiddleware, optimize, registrarSolicitudMiddleware);


module.exports = router;