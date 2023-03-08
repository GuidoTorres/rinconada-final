import { Button, Form } from "antd";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { AiOutlineForm } from "react-icons/ai";
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

	const [pagoAyuda, setPagoAyuda] = useState(pagoExtraordinarioValues);
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
			setPagoAyuda({
				...dataToEdit,
				nombre: dataToEdit.nombre,
				teletrans: parseFloat(dataToEdit.teletrans),
				observacion: dataToEdit.observacion,
				fecha_pago: dayjs(dataToEdit.fecha_pago).format("YYYY-MM-DD"),
			});
			form.setFieldsValue({
				...dataToEdit,
				nombre: dataToEdit.nombre,
				teletrans: parseFloat(dataToEdit.teletrans),
				observacion: dataToEdit.observacion,
				fecha_pago: dayjs(dataToEdit.fecha_pago).format("YYYY-MM-DD"),
			});
		} else {
			setPagoAyuda(pagoExtraordinarioValues);
		}
	}, [dataToEdit]);

	const handleData = (e, text) => {
		if (!text && e.target) {
			const { name, value } = e.target;
			form.setFieldsValue({
				[name]: value,
			});
			setPagoAyuda((values) => {
				return { ...values, [name]: value };
			});
		} else {
			form.setFieldsValue({
				[text]: e,
			});
			setPagoAyuda((values) => {
				return { ...values, [text]: e };
			});
		}
	};

	const handleSubmit = async () => {
		const route = "ayuda/programacion";
		setCargando(true);
		const data = {
			trabajador_dni: pagoAyuda.trabajador_dni || "",
			observacion: pagoAyuda.observacion || "",
			fecha_pago: dayjs(pagoAyuda.fecha_pago).format("YYYY-MM-DD") || "",
			teletrans: parseFloat(pagoAyuda.teletrans) || 0,
			tipo: pagoAyuda.tipo || "ayuda",
		};
		if (dataToEdit) {
			const response = await updateData(data, dataToEdit.pago_id, "pago");
			if (response) {
				notificacion(response.status, response.msg);
				actualizarTabla();
				closeModal();
			}
		} else {
			const response = await createData(data, route);
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
		setPagoAyuda(pagoExtraordinarioValues);
	};

	const formData = modalPagoExtraordinario(
		pagoAyuda,
		handleData,
		trabajadores,
		dataToEdit
	);

	return (
		<>
			<MainModal
				className={"modal-usuario"}
				title={dataToEdit ? "Editar incentivo" : "Registrar incentivo"}
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
					{formData.map((item, i) => (
						<Form.Item
							className={item.className}
							key={i}
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
							icon={<AiOutlineForm />}
							loading={cargando ? true : false}
						>
							{dataToEdit ? "Editar" : "Registrar"}
						</Button>
					</Form.Item>
				</Form>
			</MainModal>
		</>
	);
}
export default ModalPagoExtraordinario;
