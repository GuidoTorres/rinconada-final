import { Col, Empty, Row, Select, Space, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { CrudContext } from "../../../context/CrudContext";
import { historialLayout } from "../../../data/dataTable";
import Cargando from "../../cargando/Cargando";
import Header from "../../header/Header";
import Tabla from "../../tabla/Tabla";

const HistorialPagos = () => {
	const { getData, cargando, setCargando } = useContext(CrudContext);

	const [historial, setHistorial] = useState([]);

	const getHistorial = async () => {
		setCargando(true);
		const route = "historial";
		const response = await getData(route);
		if (response) {
			const filterNull = response.data.filter((item) => item !== null);
			setHistorial(filterNull);
			setCargando(false);
		}
	};

	useEffect(() => {
		getHistorial();
	}, []);

	const columns = historialLayout();

	const options = [
		{ value: "1", label: "Pago de casa" },
		{ value: "2", label: "Pago de agua" },
		{ value: "3", label: "Pago de luz" },
		{ value: "4", label: "Pago de gas" },
		{ value: "5", label: "Pago de internet" },
	];

	return (
		<>
			<Header text={"Historial de pagos"} ruta={"/planilla"} />
			<div className="margenes">
				<Space direction="horizontal" size="large">
					<Row>
						<Col span={18}>
							<Typography style={{ fontSize: "1.5rem" }}>
								Filtrar por:
							</Typography>
							<Select
								style={{ width: "100%" }}
								placeholder="Tipo de pago"
								defaultValue={"1"}
								onChange={options}
								options={options}
							/>
						</Col>
					</Row>
				</Space>
				{historial?.length > 0 ? (
					<Tabla columns={columns} data={historial} />
				) : (
					<>
						{cargando ? (
							<Cargando />
						) : (
							<Empty
								image={Empty.PRESENTED_IMAGE_SIMPLE}
								description={
									<span>No hay registros para mostrar.</span>
								}
							/>
						)}
					</>
				)}
			</div>
		</>
	);
};

export default HistorialPagos;
