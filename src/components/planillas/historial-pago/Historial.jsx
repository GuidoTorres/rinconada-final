import { Col, Empty, Row, Select, Space, Typography } from "antd";
import Search from "antd/es/input/Search";
import { useContext, useEffect, useState } from "react";
import { CrudContext } from "../../../context/CrudContext";
import { historialLayout } from "../../../data/dataTable";
import Cargando from "../../cargando/Cargando";
import Tabla from "../../tabla/Tabla";

function Historial() {
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
		// getHistorial();
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
		<div>
			<Row style={{ width: "100%" }}>
				<Col span={6}>
					<Space
						direction="horizontal"
						style={{
							width: "100%",
							display: "flex",
						}}
					>
						<Typography>Filtrar por:</Typography>
						<Select
							style={{ width: 150 }}
							placeholder="Tipo de pago"
							defaultValue={"1"}
							onChange={options}
							options={options}
						/>
					</Space>
				</Col>
				<Col span={6}>
					<Search
						placeholder="Buscar"
						// onSearch={onSearch}
						style={{
							width: 200,
						}}
					/>
				</Col>
			</Row>
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
	);
}
export default Historial;
