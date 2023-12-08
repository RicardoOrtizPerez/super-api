const pool = require('../config/db');
const { escribirErrorEnLog } = require('./generarArchivoLog');

const resetearContadores = async () => {
    try {
        await pool.query(`update clientes set 
        simulaciones_hoy_productivas = 0, 
        simulaciones_hoy_prueba = 0,
        recursos_hoy_productivos = 0,
        recursos_hoy_pruebas = 0
        where estatus = true`);        
    } catch (error) {
        escribirErrorEnLog(error.message);
    }
}

module.exports = { resetearContadores };