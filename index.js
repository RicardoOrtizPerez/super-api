const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
// const pool = require('./src/config/db');
const { rateLimitMiddleware, accesoMiddleware } = require('./src/middlewares/rateLimitMiddleware');

// routes
const licencia_routes = require('./src/routes/licencia_routes');
const auth_routes = require('./src/routes/auth_routes');
const cliente_routes = require('./src/routes/cliente_routes');
const toursolver_routes = require('./src/routes/toursolver_routes');
const dashboard_routes = require('./src/routes/dashboard_routes');
const verificarToken = require('./src/middlewares/authMiddleware');

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req,res) => {
    res.status(200).json({
        mensaje: 'Prueba exitosa'
    });
});

app.use('/auth', auth_routes);
app.use('/licencias',verificarToken, licencia_routes);
app.use('/clientes', verificarToken, cliente_routes);
app.use('/dashboard', verificarToken, dashboard_routes);
// integracion de api de toursolver
app.use('/toursolver',accesoMiddleware, toursolver_routes);

// crear servidor
const server = http.createServer(app);

// lanzar servidor
server.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})
