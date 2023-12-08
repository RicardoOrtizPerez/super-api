const { default: axios } = require("axios");
const { escribirErrorEnLog } = require("../utils/generarArchivoLog");

const API = process.env.TOURSOLVER_URI;

const optimize = async(req, res, next) => {
    try {
        const { body } = req;
        let recursos = 0, visitas = 0;
        let complete_endpoint = '';
        let headers = {
            'Accept': 'application/json',
            'tsCloudApiKey': req.ts_key
        }
        complete_endpoint = API + '/optimize';

        recursos = body.resources.length;
        visitas = body.orders.length;

        await axios.post(complete_endpoint, body, { headers: headers}).then((response) => {
            res.status(response.status).send(response.data);
            res.locals.customData = response.data;
            res.locals.customData.ts_key = req.ts_key;
            res.locals.customData.recursos = recursos;
            res.locals.customData.visitas = visitas;
        });

        next();
    } catch (error) {
        // si hay respuesta erronea no se registra la peticion
        escribirErrorEnLog(error.message);
        res.status(500).send({
            success:false,
            result: null,
            error: error.message
        })
    }
}

const fulfillment = async(req, res) => {
    let endpoint = '/fulfillment';
    let complete_endpoint = '';
    let headers = {
        'Accept': 'application/json',
        'tsCloudApiKey': req.ts_key
    }
    try {
        const { startDate, endDate, lastUpdate, userLogin } = req.query;
        let queryString = '';
        if (startDate) {
            queryString += `startDate=${startDate}`;
        }
        if (endDate) {
            queryString += queryString ? '&': '';
            queryString += `endDate=${endDate}`
        }
        if (lastUpdate) {
            queryString += queryString ? '&': '';
            queryString += `lastUpdate=${lastUpdate}`
        }
        if (userLogin) {
            queryString += queryString ? '&': '';
            queryString += `userLogin=${userLogin}`
        }
        if (queryString) {
            queryString = `?${queryString}`;
        }
        complete_endpoint = API+endpoint+queryString;

        await axios.get(complete_endpoint, {
            headers: headers
        }).then((response) => {
            res.status(response.status).send({
                data: response.data
            });
        })
    } catch (error) {
        escribirErrorEnLog(error.message);
        res.status(500).json({
            success: false,
            result: null,
            error: error.message
        });
    }
}

const result = async(req, res) => {
    try {
        const { taskId } = req.query;
        let complete_endpoint = '';
        let queryString = '';
        let headers = {
            'Accept': 'application/json',
            'tsCloudApiKey': req.ts_key
        }
        if (taskId) {
            queryString += `taskId=${taskId}`;
        }
        if (queryString) {
            queryString = `?${queryString}`;
        }
        complete_endpoint = API + '/result'+queryString;

        await axios.get(complete_endpoint, {
            headers: headers
        }).then((response) => {
            res.status(response.status).send({
                data: response.data
            })
        })

    } catch (error) {
        escribirErrorEnLog(error.message);
        res.status(500).json({
            success: false,
            result: null,
            error: error.message
        });
    }
}

const simulation = async(req, res) => {
    try {
        const { simulationId } = req.query;
        let complete_endpoint = '';
        let queryString = '';
        let headers = {
            'Accept': 'application/json',
            'tsCloudApiKey': req.ts_key
        }
        if (simulationId) {
            queryString += `simulationId=${simulationId}`;
        }
        if (queryString) {
            queryString = `?${queryString}`;
        }
        complete_endpoint = API + '/simulation'+queryString;

        await axios.get(complete_endpoint, {
            headers: headers
        }).then((response) => {
            res.status(response.status).send({
                data: response.data
            })
        })
    } catch (error) {
        escribirErrorEnLog(error.message);
        res.status(500).json({
            success: false,
            result: null,
            error: error.message
        });
    }
}

const status = async(req, res) => {
    try {
        const { taskId } = req.query;
        let complete_endpoint = '';
        let queryString = '';
        let headers = {
            'Accept': 'application/json',
            'tsCloudApiKey': req.ts_key
        }
        if (taskId) {
            queryString += `taskId=${taskId}`;
        }
        if (queryString) {
            queryString = `?${queryString}`;
        }
        complete_endpoint = API + '/status'+queryString;

        await axios.get(complete_endpoint, {
            headers: headers
        }).then((response) => {
            res.status(response.status).send({
                data: response.data
            })
        })
    } catch (error) {
        escribirErrorEnLog(error.message);
        res.status(500).json({
            success: false,
            result: null,
            error: error.message
        });
    }
}

const stop = async(req, res) => {
    try {
        const { taskId } = req.query;
        let complete_endpoint = '';
        let queryString = '';
        let headers = {
            'Accept': 'application/json',
            'tsCloudApiKey': req.ts_key
        }
        if (taskId) {
            queryString += `taskId=${taskId}`;
        }
        if (queryString) {
            queryString = `?${queryString}`;
        }
        complete_endpoint = API + '/stop'+queryString;

        await axios.post(complete_endpoint, {}, {
            headers: headers
        }).then((response) => {
            res.status(response.status).send({
                data: response.data
            })
        }).catch((reason) => {
            res.status(500).json({
                data: reason
            });
        })
    } catch (error) {
        escribirErrorEnLog(error.message);
        res.status(500).json({
            success: false,
            result: null,
            error: error.message
        });
    }
}

const toursResult = async(req, res) => {
    try {
        const { taskId } = req.query;
        let complete_endpoint = '';
        let queryString = '';
        let headers = {
            'Accept': 'application/json',
            'tsCloudApiKey': req.ts_key
        }
        if (taskId) {
            queryString += `taskId=${taskId}`;
        }
        if (queryString) {
            queryString = `?${queryString}`;
        }
        complete_endpoint = API + '/toursResult'+queryString;

        await axios.get(complete_endpoint, {
            headers: headers
        }).then((response) => {
            res.status(response.status).send({
                data: response.data
            })
        })
    } catch (error) {
        escribirErrorEnLog(error.message);
        res.status(500).json({
            success: false,
            result: null,
            error: error.message
        });
    }
}

const updateClients = async(req, res) => {
    try {
        const { body } = req;
        let complete_endpoint = '';
        let headers = {
            'Accept': 'application/json',
            'tsCloudApiKey': req.ts_key
        }
        
        complete_endpoint = API + '/updateClients';

        await axios.put(complete_endpoint, body, {
            headers: headers
        }).then((response) => {
            res.status(response.status).send({
                data: response.data
            })
        })
    } catch (error) {
        escribirErrorEnLog(error.message);
        res.status(500).json({
            success: false,
            result: null,
            error: error.message
        });
    }
}

const addClients = async(req, res) => {
    try {
        const { body } = req;
        let complete_endpoint = '';
        let headers = {
            'Accept': 'application/json',
            'tsCloudApiKey': req.ts_key
        }
        complete_endpoint = API + '/addClients';

        await axios.post(complete_endpoint, body, { headers: headers}).then((response) => {
            res.status(response.status).send(response.data);
        });
    } catch (error) {
        // si hay respuesta erronea no se registra la peticion
        escribirErrorEnLog(error.message);
        res.status(500).send({
            success:false,
            result: null,
            error: error.message
        })
    }
}

const addOrdersToOperationalPlanning = async(req, res) => {
    try {
        const { body } = req;
        let complete_endpoint = '';
        let headers = {
            'Accept': 'application/json',
            'tsCloudApiKey': req.ts_key
        }
        complete_endpoint = API + '/addOrdersToOperationalPlanning';

        await axios.post(complete_endpoint, body, { headers: headers}).then((response) => {
            res.status(response.status).send(response.data);
        });
    } catch (error) {
        // si hay respuesta erronea no se registra la peticion
        escribirErrorEnLog(error.message);
        res.status(500).send({
            success:false,
            result: null,
            error: error.message
        })
    }
}

module.exports = {
    optimize,
    fulfillment,
    result,
    simulation,
    status,
    stop,
    toursResult,
    updateClients,
    addClients,
    addOrdersToOperationalPlanning
}