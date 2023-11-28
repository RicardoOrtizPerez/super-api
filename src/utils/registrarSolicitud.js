const pool = require("../config/db");
const { escribirErrorEnLog } = require("./generarArchivoLog");

const registrarSolicitudParaUsuario = async(token) => {
    try {
        const ahora = new Date();

        await pool.query(`
        UPDATE clientes SET 
        simulaciones_hoy_productivas = simulaciones_hoy_productivas + 1,
        fecha_ultima_actualizacion = $2
        WHERE its_token = $1 RETURNING simulaciones_hoy_productivas`,[token, ahora]);

    } catch (error) {
        escribirErrorEnLog(error.message);
        console.error('Error al registrar la solicitud para el usuario:', error.message);
    }
}
module.exports = registrarSolicitudParaUsuario;