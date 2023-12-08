const pool = require("../config/db");
const { escribirErrorEnLog } = require("./generarArchivoLog");

const registrarSolicitudParaUsuario = async(token, entorno, recursos = 0) => {
    try {
        const ahora = new Date();

        await pool.query(`select registrarSolicitudCliente($1,$2,$3)`,[token, entorno, recursos]);

    } catch (error) {
        escribirErrorEnLog(error.message);
        console.error('Error al registrar la solicitud para el usuario:', error.message);
    }
}
module.exports = registrarSolicitudParaUsuario;