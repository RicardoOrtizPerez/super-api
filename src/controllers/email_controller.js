const { enviarEmail } = require("../utils/email");
const { escribirErrorEnLog } = require("../utils/generarArchivoLog");

const testEmail = async(req, res) => {

    try {
        const { subject, text, to, html } = req.body;
    
        let data = {
            from: 'spvsoporte62@gmail.com',
            to: to,
            subject: subject,
            text: text,
            html: html
        };
    
        let enviado = await enviarEmail(data);

        if (enviado.accepted.length > 0) {
            res.status(200).json({
                success: true,
                result: 'Correo enviado exitosamente.',
                error: null
            })
        } else {
            escribirErrorEnLog(`No de pudo enviar el correo electronico: ${enviado.mensaje}`);
            res.status(500).json({
                success: false,
                result: null,
                error: 'No de pudo enviar el correo electronico'
            });
        }
    } catch (error) {
        escribirErrorEnLog(error.message);
        res.status(500).json({
            success: false,
            result: null,
            error: error.message
        });
    }
}

module.exports = { testEmail };