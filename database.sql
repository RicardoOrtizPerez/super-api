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
	p_token text
)
returns text
as $$
declare d_id_cliente int;
declare out_message text default '';
begin
	select id_cliente into d_id_cliente from clientes where its_token = p_token;
	if d_id_cliente != 0 then
		insert into optimizaciones(fecha_optimizacion,hora_optimizacion,task_id,simulation_id, cliente_id)
		values(p_fecha_optimizacion, p_hora_optimizacion, p_task_id, p_simulation_id, d_id_cliente);
		out_message = 'SUCCESS';
	else
		out_message = 'ERROR';
	end if;
	return out_message;
end;
$$ language plpgsql;