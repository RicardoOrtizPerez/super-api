const Joi = require('joi');
const pool = require('./../../config/db');

const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
};

async function registrarClienteVal(req) {
    try {
        const schema = Joi.object({
            empresa: Joi.string()
                .required()
                .min(1)
                .max(100)
                .messages({
                    'string.base': `{{#label}} debe ser texto`,
                    'string.empty': `{{#label}} no debe estar vacío`,
                    'string.min': `{{#label}} debe tener almenos un caracter`,
                    'string.max': `{{#label}} debe tener menos de 100 caracteres`,
                    'any.required': `{{#label}} es requerido`
                }),
            cuenta: Joi.string()
                .required()
                .min(1)
                .max(255)
                .external(async (value) => {
                    const res = await pool.query('SELECT COUNT(*) FROM clientes WHERE cuenta = $1', [value]);
                    if (res.rows[0].count > 0) {
                        throw new Error("La cuenta ya existe")
                    } else {
                        return value
                    }
                })
                .messages({
                    'string.base': `{{#label}} debe ser texto`,
                    'string.empty': `{{#label}} no debe estar vacío`,
                    'string.min': `{{#label}} debe tener almenos un caracter`,
                    'string.max': `{{#label}} debe tener menos de 255 caracteres`,
                    'any.required': `{{#label}} es requerido`
                }),
            its_token: Joi.string()
                .required()
                .min(1)
                .max(255)
                .external(async (value) => {
                    const res = await pool.query('SELECT COUNT(*) FROM clientes WHERE its_token = $1', [value]);
                    if (res.rows[0].count > 0) {
                        throw new Error("El its_token ya existe")
                    } else {
                        return value
                    }
                })
                .messages({
                    'string.base': `{{#label}} debe ser texto`,
                    'string.empty': `{{#label}} no debe estar vacío`,
                    'string.min': `{{#label}} debe tener almenos un caracter`,
                    'string.max': `{{#label}} debe tener menos de 255 caracteres`,
                    'any.required': `{{#label}} es requerido`
                }),
            toursolver_key: Joi.string()
                .required()
                .min(1)
                .max(255)
                .external(async (value) => {
                    const res = await pool.query('SELECT COUNT(*) FROM clientes WHERE toursolver_key = $1', [value]);
                    if (res.rows[0].count > 0) {
                        throw new Error("El toursolver_key ya existe")
                    } else {
                        return value
                    }
                })
                .messages({
                    'string.base': `{{#label}} debe ser texto`,
                    'string.empty': `{{#label}} no debe estar vacío`,
                    'string.min': `{{#label}} debe tener almenos un caracter`,
                    'string.max': `{{#label}} debe tener menos de 255 caracteres`,
                    'any.required': `{{#label}} es requerido`
                }),
            estatus: Joi.boolean()
                .required()
                .messages({
                    'boolean.base': `{{#label}} debe ser un booleano`,
                    'any.required': `"{{#label}}" es obligatorio`,
                }),
            // validar el correo
            correo_contacto: Joi.string()
                .email()
                .required()
                .messages({
                    'string.base': `{{#label}} debe ser texto`,
                    'string.empty': `{{#label}} no puede estar vacío`,
                    'string.email': `{{#label}} no tiene el formato correcto`,
                    'any.required': `{{#label}} es requerido`
                }),
            // fecha_alta: Joi.date()
            //     .required()
            //     .messages({
            //         'date.base': `{{#label}} debe ser una fecha`,
            //         'any.required': `"{{#label}}" es obligatorio`,
            //     }),
            fecha_baja: Joi.date()
                .messages({
                    'date.base': `{{#label}} debe ser una fecha`,
                }),
            simulaciones_productivas: Joi.number()
                .required()
                .messages({
                    'number.base': `{{#label}} debe ser un numero`,
                    'any.required': `"{{#label}}" es obligatorio`,
                }),
            simulaciones_pruebas: Joi.number()
                .required()
                .messages({
                    'number.base': `{{#label}} debe ser un numero`,
                    'any.required': `"{{#label}}" es obligatorio`,
                }),
        });
        return await schema.validateAsync(req.body, options);
    } catch (error) {
        return error;
    }
}

async function bajaClienteVal(req) {
    try {
        const schema = Joi.object({
            id_cliente: Joi.number()
                .required()
                .external(async (value) => {
                    const res = await pool.query('SELECT COUNT(*) FROM clientes WHERE id_cliente = $1 and estatus = true', [value]);
                    if (res.rows[0].count > 0) {
                        return value
                    } else {
                        throw new Error("No se puede dar de baja el cliente especificado")
                    }
                })
                .messages({
                    'number.base': `{{#label}} debe ser un numero`,
                    'any.required': `"{{#label}}" es obligatorio`,
                })
        })
        return await schema.validateAsync(req.body, options);
    } catch (error) {
        return error;
    }
}


module.exports = { registrarClienteVal, bajaClienteVal };