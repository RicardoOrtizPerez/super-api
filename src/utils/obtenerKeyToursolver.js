const pool = require("../config/db");
const { escribirErrorEnLog } = require("./generarArchivoLog");

const obtenerTSKey = async(token) => {
    try {
        if (token) {
            const ts_api_key_res = await pool.query('select toursolver_key from clientes where its_token = $1', [token]);
            let key = null;
            if (ts_api_key_res.rowCount > 0) {
                key = ts_api_key_res.rows[0].toursolver_key;
            }
            return key;
        }
        return null;
    } catch (error) {
        escribirErrorEnLog(error.message);
        return null;
    }
}

module.exports = obtenerTSKey;