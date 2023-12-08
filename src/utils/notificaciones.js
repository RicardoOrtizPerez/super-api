const pool = require("../config/db");
const { enviarEmail, plantillaHtmlEmail1 } = require("./email");
const { obtenerFormatoFecha, obtenerFormatoHora } = require("./formato");
const { escribirErrorEnLog } = require("./generarArchivoLog");

const notificacionLimiteDeOptimizaciones = async (to, token_cliente, entorno, solicitudesDeHoy, limiteDiario) => {
    try {
        let cliente_resp =  await pool.query('select empresa, cuenta, tipo_conteo from clientes inner join tipo_conteo on fk_tipo_conteo = id_tipo_conteo where its_token = $1', [token_cliente]);
        if (cliente_resp.rowCount > 0) {
            let cliente = cliente_resp.rows[0];
            let limite_de = cliente.tipo_conteo == 'Recurso' ? 'recursos' : 'simulaciones';
            let fechaActual = obtenerFormatoFecha();
            let horaActual = obtenerFormatoHora();
            let mensaje = `La cuenta ${cliente.cuenta} alcanzo su limite de ${ limite_de} por día que son (${limiteDiario}) ${limite_de}, consumiendo un total de (${solicitudesDeHoy}) ${limite_de}, ${fechaActual} ${horaActual}, en entorno (${entorno})`;
            let html_mensaje = `<p>La cuenta <b>"${cliente.cuenta}"</b> alcanzo su limite de <b>${ limite_de }</b> por día que son <b>(${limiteDiario})</b> ${limite_de}, consumiendo un total de (${solicitudesDeHoy}) ${limite_de}, ${fechaActual} ${horaActual}, en entorno <b>(${entorno})</b></b></p>`;
            let html = await plantillaHtmlEmail1(html_mensaje);

            let data = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_SOPORTE_ITS,
                subject: `Limite de recursos/simulaciones de la cuenta ${cliente.cuenta} superado`,
                text: mensaje,
                html: html,
                attachments: [
                    {
                        filename: 'nomadia.png',
                        path:'./src/assets/nomadia.png',
                        cid: 'nomadia'
                    },
                    {
                        filename: 'itsmarts.png',
                        path:'./src/assets/itsmarts.png',
                        cid: 'itsmarts'
                    }
                ]
            }

            await enviarEmail(data);
        } else {
            escribirErrorEnLog(`No existe el cliente con el token especificado ${token_cliente}`);
        }
    } catch (error) {
        escribirErrorEnLog(error.message);
    }
}

module.exports = { notificacionLimiteDeOptimizaciones };