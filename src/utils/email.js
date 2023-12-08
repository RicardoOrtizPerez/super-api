const nodemailer = require('nodemailer');

const enviarEmail = async(data) => {
    let transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }

    });
    const info = await transporter.sendMail(data);
    return info;
}
// 187.190.161.55

const plantillaHtmlEmail1 = async(data) => {
    let html = `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale)1.0">

            <style>
                p, a, h1, h2, h3, h4, h5, h6 {font-family: 'Roboto', sans-serif !important;}
                h1{ font-size: 30px !important; color: #34495E; }
                h2{ font-size: 25px !important; color: #34495E; }
                h3{ font-size: 18px !important; color: #34495E; }
                h4{ font-size: 16px !important; color: #34495E; }
                p, a{font-size: 15px !important; color: #34495E; }
            </style>
        </head>
        <body>
            <div style="width: 100%; background-color: #e3e3e3;">
                <div style="padding: 20px 10px 20px 10px;">
                    <div height="100" style="background-color: #17A589; height: 30px; color: #17A589; padding: 15px 0px 15px 0px; width: 100%; text-align: center;">
                    <p style="color:#17A589;font-size: 13px; padding: 0px 30px 0px 30px">.</p>
                    </div>

                    <div style="background-color: #ffffff; padding: 10px 0px 10px 0px; width: 100%; text-align: center;">
                        <img src="cid:itsmarts" alt="itmarts-logo" width="190" style="width: 200px; height: 90px;"><br>
                        <img src="cid:nomadia" alt="nomadia-logo" width="80" style="width: 150px; height: 60px;">
                        <div style="width: 50px;"></div>
                    </div>
                    <div style="background-color: #ffffff; padding: 20px 20px 20px 20px; width: 100%; min-height: 800px; text-align: center;">
                        <h1>Alerta de uso de optimizaciones SmarTSolver </h1>
                        ${data}
                    </div>

                    <!-- footer -->
                    <div style="background-color: #17A589; color: #ffffff; padding: 5px 0px 0px 0px; width: 100%; text-align: center;">
                        <h4 style="color: #ffffff;">Soporte</h4>
                        <p style="font-size: 13px; padding: 0px 20px 0px 20px; color: #ffffff;">
                            Comunícate con nosotros por los siguientes medios:<br>
                            Correo: <a class="afooter" href="mailto:soportetoursolver@itsmarts.com.mx">soportetoursolver@itsmarts.com.mx</a><br>
                        </p>
                        <p style="background-color: #48C9B0; padding: 10px 0px 10px 0px; font-size: 12px !important;">
                            © 2023 ItSmarts Solutions, todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </body>
    </html>
    `;

    return html;
}

module.exports = { enviarEmail, plantillaHtmlEmail1 };