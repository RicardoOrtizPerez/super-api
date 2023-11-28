const pool = require("../config/db");
const { escribirErrorEnLog } = require('./../utils/generarArchivoLog');

const getAllLicences = async(req, res) => {
    try {
        let licences = await pool.query('select * from clientes');
        res.status(200).json({
            success: true,
            result: licences.rows,
            error: null
        })
    } catch (error) {
        escribirErrorEnLog(error.message);
        res.status(500).json({
            success: false,
            result: null,
            error: error.message
        })
    }
}

module.exports = { getAllLicences };