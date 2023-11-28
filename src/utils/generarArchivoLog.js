const fs = require('fs');
const { agregarCeroAlInicio } = require('./formato');

const escribirErrorEnLog = (mensajeError) => {
    const fechaHoraActual = obtenerFechaHoraActual();
    const mensajeLog = `[${fechaHoraActual}] ERROR: ${mensajeError}\n`;

    fs.appendFile('logfile.txt', mensajeLog, (err) => {
        if (err) {
            console.error('Error al escribir en el archivo de registro:', err);
        }
    })
}

const obtenerFechaHoraActual = () => {
    const fechaHora = new Date();
    const dia = agregarCeroAlInicio(fechaHora.getDate());
    const mes = agregarCeroAlInicio(fechaHora.getMonth() + 1);
    const anio = fechaHora.getFullYear();
    const horas = agregarCeroAlInicio(fechaHora.getHours());
    const minutos = agregarCeroAlInicio(fechaHora.getMinutes());
    const segundos = agregarCeroAlInicio(fechaHora.getSeconds());

    return `${dia}-${mes}-${anio} ${horas}:${minutos}:${segundos}`;
}

module.exports = { escribirErrorEnLog }