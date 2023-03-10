import {
	Button,
	Card,
	ConfigProvider,
	Form,
	Input,
	Select,
	TimePicker,
} from "antd";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { AiOutlineForm } from "react-icons/ai";
import { CrudContext } from "../../../context/CrudContext";
import { modalPagoExtraordinario } from "../../../data/FormValues";
import { pagoExtraordinarioValues } from "../../../data/initalValues";
import { notificacion } from "../../../helpers/mensajes";
import MainModal from "../../modal/MainModal";
import locale from "antd/es/date-picker/locale/es_ES";

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
	const [conductores, setConductores] = useState([]);
	const [trapiches, setTrapiches] = useState([]);

	const getConductores = async () => {
		const response = await getData("volquete");
		if (response) {
			const filterNull = response.data.filter((item) => item !== null);
			setConductores(filterNull);
		}
	};

	const getTrapiches = async () => {
		const response = await getData("trapiche");
		if (response) {
			const filterNull = response.data.filter((item) => item !== null);
			setTrapiches(filterNull);
		}
	};

	const getAllTrabajadores = async () => {
		const response = await getData("ayuda");
		setTrabajadores(response.data);
	};

	useEffect(() => {
		getAllTrabajadores();
		getConductores();
		getTrapiches();
	}, []);

	const dataConductores = conductores.map((item) => {
		return {
			value: item.propietario,
			label: item.propietario,
		};
	});

	const dataTrapiches = trapiches.map((item) => {
		return {
			value: item.nombre,
			label: item.nombre,
		};
	});

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
		const route = "ayuda/pago";
		setCargando(true);
		const data = {
			hora: dayjs(pagoAyuda.hora).format("HH:mm") || "",
			placa: pagoAyuda.placa || "",
			propietario: pagoAyuda.propietario || "",
			trapiche: pagoAyuda.trapiche || "",
			trabajador_dni: pagoAyuda.trabajador_dni || "",
			observacion: pagoAyuda.observacion || "",
			fecha_pago: dayjs(pagoAyuda.fecha_pago).format("YYYY-MM-DD") || "",
			teletrans: parseFloat(pagoAyuda.teletrans) || 0,
			volquetes: parseFloat(pagoAyuda.volquetes) || 0,
			tipo: pagoAyuda.tipo || "extraordinario",
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
					layout="vertical"
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
					<Card style={{ width: "100%" }}>
						<Form.Item
							name="conductor"
							label="Propietario"
							rules={[
								{
									required: true,
									message: "Ingrese el propietario",
								},
							]}
						>
							<Select
								showSearch
								placeholder="Propietario"
								style={{
									width: "100%",
								}}
								onChange={(e) => {
									const propietario = conductores.find(
										(item) => item.propietario === e
									);
									handleData(propietario.placa, "placa");
									handleData(
										propietario.propietario,
										"propietario"
									);
								}}
								value={pagoAyuda.propietario}
								filterOption={(input, option) =>
									(option?.label ?? "")
										.toLowerCase()
										.includes(input.toLowerCase())
								}
								options={dataConductores}
							/>
						</Form.Item>
						<Form.Item label="Placa">
							<Input
								placeholder="Placa"
								value={pagoAyuda.placa}
								readOnly
							/>
						</Form.Item>
						<Form.Item
							name="trapiche"
							label="Trapiche"
							rules={[
								{
									required: true,
									message: "Ingrese el trapiche",
								},
							]}
						>
							<Select
								showSearch
								placeholder="Trapiche"
								style={{
									width: "100%",
								}}
								name="trapiche"
								onChange={(e) => {
									const trapiche = trapiches.find(
										(item) => item.nombre === e
									);
									handleData(trapiche.nombre, "trapiche");
								}}
								value={pagoAyuda.trapiche}
								filterOption={(input, option) =>
									(option?.label ?? "")
										.toLowerCase()
										.includes(input.toLowerCase())
								}
								options={dataTrapiches}
							/>
						</Form.Item>
						<Form.Item name="hora" label="Hora">
							<ConfigProvider locale={locale}>
								<TimePicker
									name="hora"
									allowClear={false}
									format="HH:mm"
									style={{ width: "100%" }}
									onChange={(e) => {
										handleData(e, "hora");
									}}
									value={dayjs(pagoAyuda.hora)}
								/>
							</ConfigProvider>
						</Form.Item>
					</Card>

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
