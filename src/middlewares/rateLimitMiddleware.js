const { enviarEmail, plantillaHtmlEmail1 } = require("../utils/email");
const obtenerLimiteDiarioParaUsuario = require("../utils/limiteDiario");
const { notificacionLimiteDeOptimizaciones } = require("../utils/notificaciones");
const obtenerTSKey = require("../utils/obtenerKeyToursolver");
const registrarOptimizacion = require("../utils/registrarOptimizacion");
const registrarSolicitudParaUsuario = require("../utils/registrarSolicitud");
const obtenerSolicitudesDeHoyDelUsuario = require("../utils/solicitudesHoy");

const rateLimitMiddleware = async(req, res, next) => {
    const userToken = req.headers.clientetoken;
    const entorno = req.headers.entorno;

    const limiteDiario = await obtenerLimiteDiarioParaUsuario(userToken, entorno);
    const solicitudesDeHoy = await obtenerSolicitudesDeHoyDelUsuario(userToken, entorno);
    
    if (solicitudesDeHoy >= limiteDiario) {
        await notificacionLimiteDeOptimizaciones(process.env.EMAIL_SOPORTE_ITS, userToken, entorno, solicitudesDeHoy, limiteDiario);
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
    const entorno = req.headers.entorno;
    const taskId = res.locals.customData.taskId;
    const ts_key = res.locals.customData.ts_key;
    const recursos = res.locals.customData.recursos;
    const visitas = res.locals.customData.visitas;
    await registrarSolicitudParaUsuario(userToken, entorno, recursos);

    await registrarOptimizacion(userToken, taskId, ts_key, recursos, visitas, entorno);
    next();
}

module.exports = { 
    rateLimitMiddleware, 
    accesoMiddleware,
    registrarSolicitudMiddleware
};