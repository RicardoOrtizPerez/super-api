const jwt = require('jsonwebtoken');
const pool = require('../config/db');


const verificarToken = async (req, res, next) => {
    const secret_jwt = process.env.SECRET_JWT;

    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            success: false,
            result: null,
            error: 'Token no proporcionado'
        });
    }

    // verificar si el token está en la lista negra
    const tokenEnListaNegra = await pool.query('select * from tokens_invalidados where token = $1;',[token]);
    
    if (tokenEnListaNegra.rowCount > 0) {
        res.status(401).json({
            success: false,
            result: null,
            error: 'Token no válido'
        });
    }

    jwt.verify(token, secret_jwt, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                result: null,
                error: 'Token no válido'
            });
        }
        // Añadir la informacion del usuario al objeto de la solicitud pasa su uso posterior
        req.usuario = decoded;
        req.fechaExpiracion = new Date(decoded.exp * 1000);
        next();
    });
}

module.exports = verificarToken;