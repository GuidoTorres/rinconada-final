import { Button, Form } from "antd";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { CrudContext } from "../../../context/CrudContext";
import { modalPagoExtraordinario } from "../../../data/FormValues";
import { pagoExtraordinarioValues } from "../../../data/initalValues";
import { notificacion } from "../../../helpers/mensajes";
import MainModal from "../../modal/MainModal";

function ModalPagoExtraordinario({ actualizarTabla }) {
	const [form] = Form.useForm();

	const {
		createData,
		getData,
		modal,
		setModal,
		cargando,
		setCargando,
		setDataToEdit,
		dataToEdit,
		updateData,
	} = useContext(CrudContext);

	const [pagoExtraordinario, setPagoExtraordinario] = useState(
		pagoExtraordinarioValues
	);

	const [trabajadores, setTrabajadores] = useState([]);

	const getAllTrabajadores = async () => {
		const response = await getData("ayuda");
		setTrabajadores(response.data);
	};

	useEffect(() => {
		getAllTrabajadores();
	}, []);

	useEffect(() => {
		if (dataToEdit) {
			setPagoExtraordinario({
				...dataToEdit,
				trabajador_dni: dataToEdit.trabajador_dni,
				fecha_pago: dayjs(dataToEdit.fecha_pago).format("YYYY-MM-DD"),
				teletrans: parseFloat(dataToEdit.teletrans),
				observacion: dataToEdit.observacion,
			});
			form.setFieldsValue({
				...dataToEdit,
				trabajador_dni: dataToEdit.trabajador_dni,
				fecha_pago: dayjs(dataToEdit.fecha_pago).format("YYYY-MM-DD"),
				teletrans: parseFloat(dataToEdit.teletrans),
				observacion: dataToEdit.observacion,
			});
		} else {
			setPagoExtraordinario(pagoExtraordinarioValues);
		}
	}, [dataToEdit]);

	const handleData = (e, text) => {
		if (!text && e.target) {
			const { name, value } = e.target;
			form.setFieldValue({
				[name]: value,
			});
			setPagoExtraordinario((values) => {
				return {
					...values,
					[name]: value,
				};
			});
		} else {
			form.setFieldValue({
				[text]: e,
			});
			setPagoExtraordinario((values) => {
				return {
					...values,
					[text]: e,
				};
			});
		}
	};

	const handleSubmit = async () => {
		setCargando(true);
		const data = {
			trabajador_dni: pagoExtraordinario.trabajador_dni || "",
			fecha_pago:
				dayjs(pagoExtraordinario.fecha_pago).format("YYYY-MM-DD") || "",
			teletrans: parseFloat(pagoExtraordinario.teletrans) || 0,
			observacion: pagoExtraordinario.observacion || "",
			tipo: "ayuda",
		};
		if (dataToEdit) {
			const response = await updateData(
				data,
				dataToEdit.id,
				"ayuda/programacion"
			);
			if (response) {
				notificacion(response.status, response.msg);
				actualizarTabla();
				closeModal();
			}
		} else {
			const response = await createData(data, "ayuda/programacion");
			if (response) {
				notificacion(response.status, response.msg);
				actualizarTabla();
				closeModal();
			}
		}
	};

	const closeModal = () => {
		setModal(false);
		setDataToEdit(null);
		setCargando(false);
		setPagoExtraordinario(pagoExtraordinarioValues);
	};

	const formData = modalPagoExtraordinario(
		pagoExtraordinario,
		handleData,
		trabajadores,
		dataToEdit
	);

	return (
		<>
			<MainModal
				className={"modal-usuario"}
				title={
					dataToEdit
						? "Editar Pago Extraordinario"
						: "Nuevo Pago Extraordinario"
				}
				open={modal}
				width={400}
				closeModal={closeModal}
			>
				<Form
					form={form}
					className="modal-body"
					onFinish={handleSubmit}
					layout="horizontal"
				>
					{formData.map((item, index) => (
						<Form.Item
							key={index}
							name={item.name}
							rules={item.rules}
							style={{ marginBottom: "8px" }}
						>
							<>
								{item.label}
								{item.type}
							</>
						</Form.Item>
					))}
					<Form.Item className="button-container">
						<Button
							htmlType="submit"
							icon={<AiOutlineSave />}
							loading={cargando}
						>
							{dataToEdit ? "Actualizar" : "Guardar"}
						</Button>
					</Form.Item>
				</Form>
			</MainModal>
		</>
	);
}
export default ModalPagoExtraordinario;
