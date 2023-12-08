const pool = require("../config/db");
const { registrarClienteVal, bajaClienteVal } = require("../middlewares/validators/cliente_validator");
const { validarError } = require('./../utils/validacion');
const { escribirErrorEnLog } = require('./../utils/generarArchivoLog');

const getAllClientes = async(req, res) => {
    try {
        const response = await pool.query('select * from clientes');
        res.status(200).json({
            success: true,
            result: response.rows,
            error: null
        });
    } catch (error) {
        escribirErrorEnLog(error.message);
        res.status(500).json({
            success: false,
            result: null,
            error: error.message
        })
    }
}

const registrarCliente = async(req, res) => {
    try {
        const validar = validarError(await registrarClienteVal(req));
        if (validar) {
            if (validar.errores) {
                return res.status(400).send({
                    success: false,
                    result: null,
                    error: validar.errores
                });
            }
            return res.status(400).json({
                success: false,
                result: null,
                error: validar.mensaje
            })
        }

        const { empresa, cuenta, its_token, toursolver_key, estatus, correo_contacto, simulaciones_productivas, simulaciones_pruebas,recursos_productivos, recursos_pruebas, fk_tipo_conteo } = req.body;
        const response = await pool.query('select registrar_cliente($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) as result',
        [
            empresa, 
            cuenta,
            its_token,
            toursolver_key,
            estatus,
            correo_contacto,
            simulaciones_productivas,
            simulaciones_pruebas,
            recursos_productivos,
            recursos_pruebas,
            fk_tipo_conteo
        ]);
        
        if (response.rows[0].result == 'SUCCESS') {
            res.status(200).json({
                success: true,
                result: 'Cliente registrado correctamente',
                error: null
            })
        } else {
            // lista de errores de solicitud http y sus codigos
            res.status(400).json({
                success: false,
                result: null,
                error: 'Error al registrar un nuevo cliente'
            });
        }
    } catch (error) {
        escribirErrorEnLog(error.message);
        res.status(500).json({
            success: false,
            result: null,
            error: error.message
        })
    }
}

const getClientePorEmpresa = async(req, res) => {
    try {
        const { empresa } = req.body;
        let response = await pool.query('select * from clientes where empresa = $1',[empresa]);

        res.status(200).json({
            success: true,
            result: response.rows,
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

const bajaDeCliente = async(req, res) => {
    try {
        const validar = validarError(await bajaClienteVal(req));
        if (validar) {
            if (validar.errores) {
                return res.status(400).send({
                    success: false,
                    result: null,
                    error: validar.errores
                });
            }
            return res.status(400).json({
                success: false,
                result: null,
                error: validar.mensaje
            })
        }
        const {id_cliente} = req.body;
        const response = await pool.query('select baja_cliente($1) as result',[id_cliente]);
        if (response.rows[0].result == 'SUCCESS') {
            res.status(200).json({
                success: true,
                result: 'Cliente dado de baja correctamente',
                error: null
            })
        } else {
            // lista de errores de solicitud http y sus codigos
            res.status(400).json({
                success: false,
                result: null,
                error: 'Error al dar de baja al cliente'
            });
        }
    } catch (error) {
        escribirErrorEnLog(error.message);
        res.status(500).json({
            success: false,
            result: null,
            error: error.message
        })
    }
}

module.exports = {
    getAllClientes,
    registrarCliente,
    getClientePorEmpresa,
    bajaDeCliente
}