const cron = require('node-cron');
const { resetearContadores } = require('../utils/resetContadores');

const iniciarCron = () => {
    taskReset.start();
}
const pausarCron = () => {
    taskReset.stop();
}

// crear un cron que se ejecute diario a la 1 am todos los dias
let taskReset = cron.schedule('0 1 * * *', async () => {
    await resetearContadores();
});

module.exports = {
    iniciarCron,
    pausarCron
}