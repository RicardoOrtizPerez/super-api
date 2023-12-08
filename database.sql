create table clientes (
        id_cliente serial primary key,
        empresa varchar(255),
        cuenta varchar(255),
        its_token text unique,
        toursolver_key text unique,
        estatus boolean default true,
        correo_contacto text,
        fecha_alta date,
        fecha_baja date,
        simulaciones_productivas int,
        simulaciones_pruebas int,
        simulaciones_hoy_productivas int default 0,
        simulaciones_hoy_pruebas int default 0,
        fecha_ultima_actualizacion date default current_date
);

create table optimizaciones(
	id_optimizacion serial primary key,
	fecha_optimizacion date,
	hora_optimizacion time,
	task_id text,
	simulation_id text,
	cliente_id int,
	foreign key (cliente_id) references clientes (id_cliente) on delete cascade on update cascade
);

CREATE TABLE tokens_invalidados (
	id_token_invalido serial primary key,
  	token text,
  	fecha_expiracion TIMESTAMPTZ
);


create table usuarios(
	id_usuario serial primary key,
	nombre varchar(255),
	correo varchar(255) not null unique,
	password text,
	rol varchar(255),
	activo boolean
);


-- //////////////////////////////////////////////////////////////////////////////

create or replace function registrar_cliente(
        p_empresa varchar(255),
        p_cuenta varchar(255),
        p_its_token varchar(255),
        p_toursolver_key varchar(255),
        p_estatus boolean,
        p_correo_contacto varchar(255),
        p_simulaciones_productivas int,
        p_simulaciones_pruebas int
)
returns text
as $$
declare id integer default 0;
declare out_mensaje varchar(255) default '';
begin
        insert into clientes(empresa,cuenta,its_token,toursolver_key,estatus,correo_contacto,fecha_alta,simulaciones_productivas,simulaciones_pruebas) values (p_empresa, p_cuenta, p_its_token, p_toursolver_key, p_estatus, p_correo_contacto, current_date, p_simulaciones_productivas, p_simulaciones_pruebas) returning id_cliente into id;
        
        if id > 0 then
         out_mensaje = 'SUCCESS';
        else
         out_mensaje = 'ERROR';
        end if;
        RETURN out_mensaje;
END;
$$ LANGUAGE plpgsql;


---------------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.baja_cliente(
	p_id_cliente integer
)
RETURNS text
AS $$
declare result integer default 0;
declare out_mensaje varchar(255) default '';
begin
        update clientes set estatus = false, fecha_baja = current_date where id_cliente = p_id_cliente returning 1 into result;
		if result > 0 then
         out_mensaje = 'SUCCESS';
        else
         out_mensaje = 'ERROR';
        end if;
        RETURN out_mensaje;
END;
$$ LANGUAGE plpgsql;



------------------------------------------------------------------------------------------------------------------------
create or replace function registrar_optimizacion(
	p_fecha_optimizacion date,
	p_hora_optimizacion time,
	p_task_id text,
	p_simulation_id text,
	p_token text,
        p_recursos integer,
        p_visitas integer
)
returns text
as $$
declare d_id_cliente int;
declare out_message text default '';
begin
	select id_cliente into d_id_cliente from clientes where its_token = p_token;
	if d_id_cliente != 0 then
		insert into optimizaciones(fecha_optimizacion,hora_optimizacion,task_id,simulation_id, cliente_id, recursos_enviados, visitas_enviadas)
		values(p_fecha_optimizacion, p_hora_optimizacion, p_task_id, p_simulation_id, d_id_cliente, p_recursos, p_visitas);
		out_message = 'SUCCESS';
	else
		out_message = 'ERROR';
	end if;
	return out_message;
end;
$$ language plpgsql;



alter table optimizaciones add column recursos_enviados integer default 0;
alter table optimizaciones add column visitas_enviadas integer default 0;

-- alter table clientes add column recursos_dia integer default 0;
-- alter table clientes add column recursos_dia_hoy integer default 0;


create table tipo_conteo(
	id_tipo_conteo serial primary key,
	tipo_conteo text
);

insert into tipo_conteo(tipo_conteo) values('Optimizacion'),('Recurso');

alter table clientes add column fk_tipo_conteo integer references tipo_conteo(id_tipo_conteo) default 1;
alter table clientes add column recursos_productivos integer default 0;
alter table clientes add column recursos_pruebas integer default 0;
alter table clientes add column recursos_hoy_productivos integer default 0;
alter table clientes add column recursos_hoy_pruebas integer default 0;

CREATE OR REPLACE FUNCTION obtenerLimiteCliente(
	p_its_token text, 
	p_entorno_cliente text
)
RETURNS integer AS $$
DECLARE 
    resultado integer default 0;
BEGIN
    SELECT
        COALESCE(
            CASE 
                WHEN fk_tipo_conteo = 1 AND p_entorno_cliente = 'pruebas' THEN simulaciones_pruebas
                WHEN fk_tipo_conteo = 1 AND p_entorno_cliente = 'productivo' THEN simulaciones_productivas
                WHEN fk_tipo_conteo = 2 AND p_entorno_cliente = 'pruebas' THEN recursos_pruebas
                WHEN fk_tipo_conteo = 2 AND p_entorno_cliente = 'productivo' THEN recursos_productivos
            END
        )
    INTO resultado
    FROM clientes
    WHERE its_token = p_its_token;

    RETURN resultado;
END $$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION obtenerSolicitudesHoy(
	p_its_token text,
	p_entorno_cliente text
)
RETURNS integer AS $$
DECLARE
	resultado integer default 0;
BEGIN
	SELECT
        COALESCE(
            CASE 
                WHEN fk_tipo_conteo = 1 AND p_entorno_cliente = 'pruebas' THEN simulaciones_hoy_pruebas
                WHEN fk_tipo_conteo = 1 AND p_entorno_cliente = 'productivo' THEN simulaciones_hoy_productivas
                WHEN fk_tipo_conteo = 2 AND p_entorno_cliente = 'pruebas' THEN recursos_hoy_pruebas
                WHEN fk_tipo_conteo = 2 AND p_entorno_cliente = 'productivo' THEN recursos_hoy_productivos
            END
        )
    INTO resultado
    FROM clientes
    WHERE its_token = p_its_token;

    RETURN resultado;
END
$$ language plpgsql


create or replace function registrarSolicitudCliente(
p_its_token text, p_entorno_cliente text, p_recursos integer default 0
) RETURNS integer as $$
DECLARE 
	resultado integer default 0;
	tipo_conteo integer default 1;
BEGIN
	select fk_tipo_conteo into tipo_conteo from clientes where its_token = p_its_token;
	if tipo_conteo = 1 then
		-- aplica para las optimizaciones
		if p_entorno_cliente = 'pruebas' then
			update clientes set simulaciones_hoy_pruebas = (simulaciones_hoy_pruebas + 1), fecha_ultima_actualizacion = current_date where its_token = p_its_token;
			resultado = 1;
		else
			update clientes set simulaciones_hoy_productivas = (simulaciones_hoy_productivas + 1), fecha_ultima_actualizacion = current_date where its_token = p_its_token;
			resultado = 1;
		end if;
	else
		-- aplica para los recursos
		if p_entorno_cliente = 'pruebas' then
			update clientes set recursos_hoy_pruebas = (recursos_hoy_pruebas + p_recursos), fecha_ultima_actualizacion = current_date where its_token = p_its_token;
			resultado = 1;
		else
			update clientes set recursos_hoy_productivos = (recursos_hoy_productivos + p_recursos), fecha_ultima_actualizacion = current_date where its_token = p_its_token;
			resultado = 1;
		end if;
	end if;
	return resultado;
END
$$ language plpgsql


drop function registrar_optimizacion;
alter table optimizaciones add column entorno text;
create or replace function registrar_optimizacion(
	p_fecha_optimizacion date,
	p_hora_optimizacion time,
	p_task_id text,
	p_simulation_id text,
	p_token text,
    p_recursos integer,
    p_visitas integer,
	p_entorno text
)
returns text
as $$
declare d_id_cliente int;
declare out_message text default '';
begin
	select id_cliente into d_id_cliente from clientes where its_token = p_token;
	if d_id_cliente != 0 then
		insert into optimizaciones(fecha_optimizacion,hora_optimizacion,task_id,simulation_id, cliente_id, recursos_enviados, visitas_enviadas, entorno)
		values(p_fecha_optimizacion, p_hora_optimizacion, p_task_id, p_simulation_id, d_id_cliente, p_recursos, p_visitas, p_entorno);
		out_message = 'SUCCESS';
	else
		out_message = 'ERROR';
	end if;
	return out_message;
end;
$$ language plpgsql;






drop function registrar_cliente;

CREATE OR REPLACE FUNCTION public.registrar_cliente(
	p_empresa character varying,
	p_cuenta character varying,
	p_its_token character varying,
	p_toursolver_key character varying,
	p_estatus boolean,
	p_correo_contacto character varying,
	p_simulaciones_productivas integer,
	p_simulaciones_pruebas integer,
	p_recursos_productivos integer,
	p_recursos_pruebas integer,
	p_conteo integer
)
    RETURNS text
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    
AS $BODY$
declare id integer default 0;
declare out_mensaje varchar(255) default '';
begin
        insert into clientes(
			empresa,
			cuenta,
			its_token,
			toursolver_key,
			estatus,
			correo_contacto,
			fecha_alta,
			simulaciones_productivas,
			simulaciones_pruebas,
			fk_tipo_conteo,
			recursos_productivos,
			recursos_pruebas,
			recursos_hoy_productivos,
			recursos_hoy_pruebas
		) values (p_empresa, p_cuenta, p_its_token, p_toursolver_key, p_estatus, p_correo_contacto, current_date, 
				  p_simulaciones_productivas, 
				  p_simulaciones_pruebas,
				  p_conteo,
				  p_recursos_productivos,
				  p_recursos_pruebas,
				  0,
				  0
				 ) returning id_cliente into id;
        
        if id > 0 then
         out_mensaje = 'SUCCESS';
        else
         out_mensaje = 'ERROR';
        end if;
        RETURN out_mensaje;
END;
$BODY$;

