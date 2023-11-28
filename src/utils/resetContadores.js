const { escribirErrorEnLog } = require('./generarArchivoLog');

const resetearContadores = async () => {
    try {
        await pool.query(`update cliente set simulaciones_hoy_productivas = 0 where estatus = true`);        
    } catch (error) {
        escribirErrorEnLog(error.message);
    }
}

module.exports = { resetearContadores };