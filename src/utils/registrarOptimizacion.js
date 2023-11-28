const { default: axios } = require("axios");
const pool = require("../config/db");
const { obtenerFormatoFecha, obtenerFormatoHora } = require("./formato");
const { escribirErrorEnLog } = require("./generarArchivoLog");

const API = process.env.TOURSOLVER_URI;

const registrarOptimizacion = async(token, taskId, ts_key) => {
    try {
        let simulationId = null;
        await pool.query(`select registrar_optimizacion($1,$2,$3,$4,$5) as result`,[obtenerFormatoFecha(new Date), obtenerFormatoHora(new Date()), taskId,simulationId,token]);
    } catch (error) {
        escribirErrorEnLog(error.message);
        console.log(`Error al registrar la optimización del cliente`, error.message);
    }
}

module.exports = registrarOptimizacion;