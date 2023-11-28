const validarError = (validar) => {
    if (validar) {
        if (validar.details) {
            if (validar.details.message != null && validar.details.details == null) {
                return { mensaje: `Error de validacion: ${validar.details.message}`}
            }
            let errores = [];
            if (validar.details.details) {
                validar.details.details.map(x => {
                    errores.push(x.message.replace(/["']/g,""));
                });
            } else {
                validar.details.map(x => {
                    errores.push(x.message.replace(/["']/g,""));
                });
            }
            return {
                mensaje: 'Error de validación',
                errores
            }
        } else if (validar.message) {
            return {
                mensaje: 'Error de validación',
                errores: validar.message
            };
        }
    }
    return null;
}

module.exports = { validarError };