const obtenerFormatoFecha = (fecha = new Date()) => {
    const dia = agregarCeroAlInicio(fecha.getDate());
    const mes = agregarCeroAlInicio(fecha.getMonth() + 1);
    const anio = fecha.getFullYear();
    return `${anio}-${mes}-${dia}`;
}

const agregarCeroAlInicio = (numero) => {
    return numero < 10 ? `0${numero}` : numero;
}

const obtenerFormatoHora = (fecha = new Date()) => {
    const horas = agregarCeroAlInicio(fecha.getHours());
    const minutos = agregarCeroAlInicio(fecha.getMinutes());
    const segundos = agregarCeroAlInicio(fecha.getSeconds());
    return `${horas}:${minutos}:${segundos}`;
}

module.exports = { obtenerFormatoFecha, obtenerFormatoHora, agregarCeroAlInicio };