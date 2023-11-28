const jwt = require("jsonwebtoken");

const generarToken = (usuario) => {
    const secret_jwt = process.env.SECRET_JWT;
    const payload = {
        usuarioId: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
    };
    // generar token que expira en 3 horas
    const token = jwt.sign(payload, secret_jwt, {expiresIn: '3hr'});
    return token;
}

module.exports = generarToken;