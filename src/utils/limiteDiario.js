const pool = require("../config/db");
const { escribirErrorEnLog } = require('./generarArchivoLog');

const obtenerLimiteDiarioParaUsuario = async(token, entorno) => {
    try {
        if (token && entorno) {
            const cliente = await pool.query(`select obtenerLimiteCliente($1,$2) as simulaciones`,[token, entorno]);
            // console.log(cliente.rows[0].simulaciones)
            return cliente.rows[0].simulaciones;
        }
        return 0; // sin token no existe limite diario 
    } catch (error) {
        escribirErrorEnLog(error.message);
        console.error('Error al obtener el limite diario para el usuario:', error.message);
        return 0; // devuelve 0 en caso de error
    }
}

module.exports = obtenerLimiteDiarioParaUsuario;