const { escribirErrorEnLog } = require("../utils/generarArchivoLog");
const pool = require('./../config/db');

const getContadorOptimizacionesPorDia = async(req, res) => {
    try {
        const { fecha_inicio, fecha_fin, agrupar_por = 'dia' } = req.body;
        let query_string = '';
        let group_by = '', group_by_clausule = '';
        let string_group = 'nombre_mes';
        let i = 1;
        let params = [];

        if (fecha_inicio && fecha_fin) {
            query_string += ` where date(fecha_optimizacion) BETWEEN $${i} and $${i+1} `;
            params.push(fecha_inicio);
            params.push(fecha_fin);
            i = i + 2;
        }

        if (agrupar_por == 'dia') {
            string_group = 'nombre_dia';
            group_by_clausule = 'fecha ';
            group_by = ` 
            to_char(fecha_optimizacion, 'YYYY-MM-DD') as fecha, 
            TO_CHAR(fecha_optimizacion, 'TMDay') as ${string_group} `;

        } else if (agrupar_por == 'mes') {
            string_group = 'nombre_mes';
            group_by_clausule = 'fecha ';
            group_by = ` to_char(fecha_optimizacion, 'YYYY-MM') as fecha,
            TO_CHAR(fecha_optimizacion, 'TMMonth') as ${string_group} `;

        } else if (agrupar_por == 'año') {
            string_group = 'nombre_anio';
            group_by_clausule = 'fecha ';
            group_by = ` extract(YEAR from fecha_optimizacion) as fecha,
            extract(YEAR from fecha_optimizacion) as ${string_group} `;
        }

        let response = await pool.query(`
            select ${group_by}, 
            count(*) as optimizaciones 
            from optimizaciones ${query_string} 
            group by ${group_by_clausule}, ${string_group}
            order by ${group_by_clausule} desc`,
        params);
        
        res.status(200).json({
            success: true,
            result: response.rows,
            error: null
        });
    } catch (error) {
        escribirErrorEnLog(error.message);
        res.status(500).json({
            success: false,
            result: null,
            error: error.message
        });
    }
}

const getContadorOptimizacionesPorDiayCliente = async(req, res) => {
    try {
        const { fecha_inicio, fecha_fin, id_cliente, agrupar_por = 'dia' } = req.body;
        let query_string = '';
        let group_by = '', group_by_clausule = '', string_group = 'nombre_dia';
        let params = [];
        let i = 1;

        if (fecha_inicio && fecha_fin) {
            query_string += ` where date(fecha_optimizacion) BETWEEN $${i} and $${i+1} `;
            i = i + 2;
            params.push(fecha_inicio);
            params.push(fecha_fin);
        }

        if (id_cliente) {
            if (i > 0) {
                query_string += " AND ";
                query_string += ` cliente_id = $${i}`;
            }
            params.push(id_cliente);
        }

        if (agrupar_por == 'dia') {
            string_group = 'nombre_dia';
            group_by_clausule = 'fecha, cuenta_cliente, empresa ';
            group_by = ` 
            to_char(fecha_optimizacion, 'YYYY-MM-DD') as fecha, 
            TO_CHAR(fecha_optimizacion, 'TMDay') as ${string_group} `;

        } else if (agrupar_por == 'mes') {
            string_group = 'nombre_mes';
            group_by_clausule = 'fecha, cuenta_cliente, empresa ';
            group_by = ` to_char(fecha_optimizacion, 'YYYY-MM') as fecha,
            TO_CHAR(fecha_optimizacion, 'TMMonth') as ${string_group} `;

        } else if (agrupar_por == 'año') {
            string_group = 'nombre_anio';
            group_by_clausule = 'fecha, cuenta_cliente, empresa ';
            group_by = ` extract(YEAR from fecha_optimizacion) as fecha,
            extract(YEAR from fecha_optimizacion) as ${string_group} `;
        }

        let query = `select 
        ${group_by}, 
        count(*) as optimizaciones,
        cuenta as cuenta_cliente,
        empresa,
        sum(o.recursos_enviados) as recursos,
        sum(o.visitas_enviadas) as visitas,
        SUM(CASE WHEN entorno = 'pruebas' THEN o.recursos_enviados ELSE 0 END) AS recursos_pruebas,
        SUM(CASE WHEN entorno = 'productivo' THEN o.recursos_enviados ELSE 0 END) AS recursos_productivo,
        SUM(CASE WHEN entorno = 'pruebas' THEN 1 ELSE 0 END) AS optimizaciones_pruebas,
        SUM(CASE WHEN entorno = 'productivo' THEN 1 ELSE 0 END) AS optimizaciones_productivas
        from optimizaciones o inner join clientes c on c.id_cliente = o.cliente_id
        ${query_string}
        group by ${group_by_clausule}, ${string_group}
        order by
        fecha desc, cuenta_cliente desc, empresa desc`;

        let response = await pool.query(query,params);
        
        res.status(200).json({
            success: true,
            result: response.rows,
            error: null
        });
    } catch (error) {
        escribirErrorEnLog(error.message);
        res.status(500).json({
            success: false,
            result: null,
            error: error.message
        });
    }
}

const getOptimizaciones = async(req, res) => {
    try {
        const { fecha_inicio, fecha_fin, id_cliente } = req.body;
        let i = 1;
        let params = [];
        let query_string = '';
        if (fecha_inicio && fecha_fin) {
            query_string += `where date(fecha_optimizacion) between $${i} and $${i+1} `;
            params.push(fecha_inicio);
            params.push(fecha_fin);
            i+=2;
        }
        if (id_cliente) {
            if (i > 1) {
                query_string += " and ";
                query_string += ` c.id_cliente = $${i} `;
            } else {
                query_string += " where ";
                query_string += ` c.id_cliente = $${i} `;
            }
            params.push(id_cliente);
        }
        let query = `select 
        o.id_optimizacion, 
        to_char(o.fecha_optimizacion,'dd-MM-yyyy') as fecha, 
        o.hora_optimizacion, 
        o.task_id, 
        o.recursos_enviados,
        o.visitas_enviadas,
        c.id_cliente, 
        c.empresa, 
        c.cuenta from optimizaciones o inner join clientes c on c.id_cliente = o.cliente_id ${query_string} order by o.fecha_optimizacion desc, c.empresa desc, c.cuenta desc`;
        let response = await pool.query(query,params);
        res.status(200).json({
            success: true,
            result: response.rows,
            error: null
        });

    } catch (error) {
        escribirErrorEnLog(error.message);
        res.status(500).json({
            success: false,
            result: null,
            error: error.message
        });
    }
}


module.exports = { getContadorOptimizacionesPorDia, getContadorOptimizacionesPorDiayCliente, getOptimizaciones };