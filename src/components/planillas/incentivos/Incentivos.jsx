import { Col, Empty, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineForm } from "react-icons/ai";
import { CrudContext } from "../../../context/CrudContext";
import { PlanillaContext } from "../../../context/PlanillaContext";
import { incentivosLayout } from "../../../data/dataTable";
import { notificacion } from "../../../helpers/mensajes";
import ButtonAdd from "../../Button/ButtonAdd";
import Cargando from "../../cargando/Cargando";
import Header from "../../header/Header";
import Tabla from "../../tabla/Tabla";
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

	const [incentivos, setIncentivos] = useState([]);

	const getIncentivos = async () => {
		const response = await getData("incentivo");
		if (response) {
			const filterNull = response.data.filter((item) => item !== null);
			setIncentivos(filterNull);
			setCargando(false);
		}
	};

	useEffect(() => {
		getIncentivos();
	}, []);

	const handleEdit = (e) => {
		setModal(true);
		setDataToEdit(e);
	};

	const handleDelete = async (e) => {
		console.log("🚀 ~ file: Incentivos.jsx:50 ~ handleDelete ~ e:", e);
		const response = await deleteData("pago", e);
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
					<Col span={18}></Col>
					<Col span={6} align="end">
						<ButtonAdd
							title="Crear incentivo"
							onClick={() => setModal(true)}
							icon={<AiOutlineForm />}
						/>
					</Col>
				</Row>
				{incentivos?.length > 0 ? (
					<Tabla columns={columns} table={incentivos} />
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
