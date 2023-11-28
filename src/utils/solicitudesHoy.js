const pool = require('./../config/db');
const { escribirErrorEnLog } = require('./generarArchivoLog');

const obtenerSolicitudesDeHoyDelUsuario = async (token) => {
    try {
        if (token) {
            const cliente = await pool.query(`select simulaciones_hoy_productivas from clientes where its_token = $1`,[token]);
            return cliente.rows[0].simulaciones_hoy_productivas;
        }
        return 0;
    } catch (error) {
        escribirErrorEnLog(error.message);
        console.error(`Error al obtener las solicitudes de hoy para el usuario:`, error.message);
        return 0;
    }
}

module.exports = obtenerSolicitudesDeHoyDelUsuario;