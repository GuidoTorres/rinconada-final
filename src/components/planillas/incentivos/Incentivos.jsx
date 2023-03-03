import { Button, Col, Empty, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { CrudContext } from "../../../context/CrudContext";
import { PlanillaContext } from "../../../context/PlanillaContext";
import { incentivosLayout } from "../../../data/dataTable";
import { notificacion } from "../../../helpers/mensajes";
import Cargando from "../../cargando/Cargando";
import Header from "../../header/Header";
import Tabla from "../../tabla/Tabla";
import BuscadorControlPlanilla from "../BuscadorControlPlanilla";
import ModalJuntarTeletrans from "../control/ModalJuntarTeletrans";
import ModalIncentivo from "./ModalIncentivo";

const Incentivos = () => {
	const {
		getData,
		setDataToEdit,
		modal,
		setModal,
		cargando,
		setCargando,
		deleteData,
	} = useContext(CrudContext);

	const { juntarTeletrans, setJuntarTeletrans } = useContext(PlanillaContext);

	const [pagos, setPagos] = useState([]);

	const getIncentivos = async () => {
		const response = await getData("incentivo");
		if (response) {
			const filterNull = response.data.filter((item) => item !== null);
			setPagos(filterNull);
			setCargando(false);
		}
	};

	useEffect(() => {
		getIncentivos();
	}, []);

	// const handleData = (event, e, i) => {
	// 	const { name, value } = event.target;

	// 	setPagos((state) =>
	// 		state.map((item, index) => {
	// 			if (index === i) {
	// 				return {
	// 					...item,
	// 					[name]: value,
	// 				};
	// 			}
	// 		})
	// 	);
	// };

	// const postPagos = async (e) => {
	// 	console.log(e);
	// 	const info = {
	// 		constrato_id: e.contrato,
	// 		observacion: e.observacion,
	// 		fecha_pago: e.fecha_pago,
	// 		teletrans: parseFloat(e.teletrans),
	// 		tipo: "incentivo",
	// 	};

	// 	// const response = await createData(info, "incentivo");

	// 	// if (response) {
	// 	// 	notificacion(response.status, response.msg);
	// 	// 	getIncentivos();
	// 	// }
	// };

	const handleEdit = (e) => {
		console.log("🚀 ~ file: Incentivos.jsx:76 ~ handleEdit ~ e:", e);
		setModal(true);
		setDataToEdit(e);
	};

	const handleDelete = async (e) => {
		const response = await deleteData(e, "incentivo");
		if (response) {
			notificacion(response.status, response.msg);
			getIncentivos();
		}
	};

	const columns = incentivosLayout(handleEdit, handleDelete);

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
							onClick={() => setModal(true)}
						>
							Crear incentivo
						</Button>
					</Col>
				</Row>
				{pagos?.length > 0 ? (
					<Tabla columns={columns} table={pagos} />
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
				{/* {juntarTeletrans && (
					<ModalJuntarTeletrans
						open={juntarTeletrans}
						//   selected={tableData}
						//   actualizarTabla={getTrabajadores}
					/>
				)} */}
			</div>
			{modal && <ModalIncentivo actualizarTabla={getIncentivos} />}
		</>
	);
};

export default Incentivos;
