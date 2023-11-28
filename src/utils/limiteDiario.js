const pool = require("../config/db");
const { escribirErrorEnLog } = require('./generarArchivoLog');

const obtenerLimiteDiarioParaUsuario = async(token) => {
    try {
        if (token) {
            const cliente = await pool.query(`select simulaciones_productivas from clientes where its_token = $1`,[token]);
            return cliente.rows[0].simulaciones_productivas;
        }
        return 0; // sin token no existe limite diario 
    } catch (error) {
        escribirErrorEnLog(error.message);
        console.error('Error al obtener el limite diario para el usuario:', error.message);
        return 0; // devuelve 0 en caso de error
    }
}

module.exports = obtenerLimiteDiarioParaUsuario;