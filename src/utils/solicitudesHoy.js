const pool = require('./../config/db');
const { escribirErrorEnLog } = require('./generarArchivoLog');

const obtenerSolicitudesDeHoyDelUsuario = async (token, entorno) => {
    try {
        if (token && entorno) {
            const cliente = await pool.query(`select obtenerSolicitudesHoy($1,$2) as simulaciones`,[token, entorno]);
            return cliente.rows[0].simulaciones;
        }
        return 0;
    } catch (error) {
        escribirErrorEnLog(error.message);
        return 0;
    }
}

module.exports = obtenerSolicitudesDeHoyDelUsuario;