import { Button, Col, Empty, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { CrudContext } from "../../../context/CrudContext";
import { PlanillaContext } from "../../../context/PlanillaContext";
import { incentivosLayout } from "../../../data/dataTable";
import { notificacion } from "../../../helpers/mensajes";
import Header from "../../header/Header";
import Tabla from "../../tabla/Tabla";
import BuscadorControlPlanilla from "../BuscadorControlPlanilla";
import ModalJuntarTeletrans from "../control/ModalJuntarTeletrans";

const Incentivos = () => {
	const { getData, createData } = useContext(CrudContext);
	const { juntarTeletrans, setJuntarTeletrans } = useContext(PlanillaContext);

	const [pagos, setPagos] = useState([]);

	const getIncentivos = async () => {
		const response = await getData("incentivo");
		if (response) {
			const filterNull = response.data.filter((item) => item !== null);
			setPagos(filterNull);
		}
	};

	useEffect(() => {
		getIncentivos();
	}, []);

	const handleData = (event, e, i) => {
		const { name, value } = event.target;

		setPagos((state) =>
			state.map((item, index) => {
				if (index === i) {
					return {
						...item,
						[name]: value,
						contrato_id: e.incentivos.contrato_id,
						id: e?.incentivos?.id || "",
					};
				}
			})
		);
	};

	const postPagos = async (e) => {
		console.log(e);
		const info = {
			id: e.id || "",
			contrato_id: e.contrato_id,
			tipo: "incentivo",
			observacion: e.observacion,
			fecha_pago: e.fecha_pago,
			teletrans: parseFloat(e.teletrans),
		};

		const response = await createData(info, "incentivo");

		if (response) {
			notificacion(response.status, response.msg);
			getIncentivos();
		}
	};

	const columns = incentivosLayout(handleData, postPagos);

	return (
		<>
			<Header text={"Incentivos"} ruta={"/planilla"} />
			<div className="margenes">
				<Row align="middle">
					<Col span={18}>
						<BuscadorControlPlanilla
							abrirModal={setJuntarTeletrans}
							registrar={true}
							crear={false}
							exportar={false}
							cargar={false}
						/>
					</Col>
					<Col span={6} align="end">
						<Button
							type="primary"
							shape="round"
							onClick={() => setJuntarTeletrans(true)}
						>
							Crear incentivo
						</Button>
					</Col>
				</Row>
				{pagos?.length > 0 ? (
					<Tabla columns={columns} table={pagos} />
				) : (
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description={
							<span>No hay registros para mostrar.</span>
						}
					/>
				)}
				{/* {juntarTeletrans && (
					<ModalJuntarTeletrans
						open={juntarTeletrans}
						//   selected={tableData}
						//   actualizarTabla={getTrabajadores}
					/>
				)} */}
			</div>
		</>
	);
};

export default Incentivos;
