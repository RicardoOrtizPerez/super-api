const pool = require("../config/db");
const bcrypt = require('bcrypt');
const generarToken = require("../utils/generarToken");

const login = async(req,res) => {
    try {
        const { correo, password } = req.body;
        const usuarios_resp =await pool.query(`select * from usuarios where correo = $1`,[correo]);
        if (usuarios_resp.rowCount > 0) {
            const usuario = usuarios_resp.rows[0]; 
            // verificar la contraseña
            const validPassword = await bcrypt.compare(password, usuario.password);
    
            if (!validPassword) {
                return res.status(401).json({
                    success: true,
                    result: 'Credenciales invalidas',
                    error: null
                });
            }

            // Generar token y enviarlo como respuesta
            const token = generarToken(usuario);
            res.status(200).json({
                success: true,
                result: {token: token},
                error: null,
            });
        } else {
            return res.status(401).json({
                success: true,
                result: 'Credenciales invalidas',
                error: null
            });
        }


    } catch (error) {
        // regresa el error 
        res.status(500).json({
            success: false,
            result: null,
            error: error.message
        });
    }
}

const registrarUsuario = async(req, res) => {
    try {
        const { nombre, correo, password, rol } = req.body;

        // verificar si el correo ya existe
        const exists_res = await pool.query(`select * from usuarios where correo = $1`,[correo]);
        if (exists_res.rowCount > 0) {
            return res.status(400).json({ success: false, result: null, error: 'El usuario ya existe' });
        }

        // encriptar la contaseña antes de almacenarla en la base de datos
        const encryptedPassword = await bcrypt.hash(password, 10);
        // insertar el nuevo usuario en la base de datos
        console.log(encryptedPassword)
        const nuevoUsuario = await pool.query('insert into usuarios (nombre, correo, password, rol) values($1,$2,$3,$4) returning id_usuario, nombre, correo, rol',[nombre, correo, encryptedPassword, rol]);
        console.log(nuevoUsuario);
        let result = 'Error al registrar usuario';
        let code = 400;
        let error = null;
        if (nuevoUsuario.rowCount > 0) {
            code = 200;
            result = 'Usuario registrado correctamente';
            error = null;
        } else {
            error = 'El usuario ya existe';
        }
        res.status(code).json({
            success: true,
            result: result,
            error: error
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            result: null,
            error: err.message
        });
    }
}

const logout = async(req, res) => {
    console.log(req.usuario);
    const token = req.headers.authorization;

    if (!token) {
        return res.status(400).json({
            success: false,
            result: null,
            errror: 'Token no proporcionado'
        });
    }
    // Añadir el token a la lista negra token que ya cerro sesion
    await pool.query('Insert into tokens_invalidados (token, fecha_expiracion) values($1,$2)',[token, req.fechaExpiracion]);

    res.status(200).json({
        success: true,
        result: 'Cierre de sesión exitoso',
        error: null
    });
}

module.exports = {
    login,
    registrarUsuario,
    logout
}