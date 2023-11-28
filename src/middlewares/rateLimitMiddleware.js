const obtenerLimiteDiarioParaUsuario = require("../utils/limiteDiario");
const obtenerTSKey = require("../utils/obtenerKeyToursolver");
const registrarOptimizacion = require("../utils/registrarOptimizacion");
const registrarSolicitudParaUsuario = require("../utils/registrarSolicitud");
const obtenerSolicitudesDeHoyDelUsuario = require("../utils/solicitudesHoy");

const rateLimitMiddleware = async(req, res, next) => {
    const userToken = req.headers.clientetoken;

    const limiteDiario = await obtenerLimiteDiarioParaUsuario(userToken);
    const solicitudesDeHoy = await obtenerSolicitudesDeHoyDelUsuario(userToken);
    
    if (solicitudesDeHoy >= limiteDiario) {
        return res.status(429).json({ mensaje: 'Limite diario de solicitudes alcanzado' });
    }
    // await registrarSolicitudParaUsuario(userToken);
    next();
}

const accesoMiddleware = async(req, res, next) => {
    const clienteToken = req.headers.clientetoken;
    
    const tskey = await obtenerTSKey(clienteToken);
    console.log(tskey)
    if (tskey === null) {
        return res.status(401).json({
            success: false,
            result: null,
            error: 'Token de cliente no valido' 
        });
    }

    req.ts_key = tskey;
    next();
}

const registrarSolicitudMiddleware = async(req, res, next) => {
    
    const userToken = req.headers.clientetoken;
    const taskId = res.locals.customData.taskId;
    const ts_key = res.locals.customData.ts_key;
    await registrarSolicitudParaUsuario(userToken);

    await registrarOptimizacion(userToken, taskId, ts_key);
    next();
}

module.exports = { 
    rateLimitMiddleware, 
    accesoMiddleware,
    registrarSolicitudMiddleware
};