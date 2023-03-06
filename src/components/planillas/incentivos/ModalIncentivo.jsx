import { Button, Form } from "antd";
import { useContext, useEffect, useState } from "react";
import { CrudContext } from "../../../context/CrudContext";
import { incentivoValues } from "../../../data/initalValues";
import MainModal from "../../modal/MainModal";
import { notificacion } from "../../../helpers/mensajes";
import { AiOutlineForm, AiOutlineTeam } from "react-icons/ai";
import { modalIncentivo } from "../../../data/FormValues";
import dayjs from "dayjs";
import ModalButtonTitle from "../../modal/ModalButtonTitle";
import ModalJuntarTeletrans from "./ModalJuntarTeletrans";

function ModalIncentivo({ actualizarTabla }) {
	const [form] = Form.useForm();
	const route = "incentivo";

	const {
		createData,
		getData,
		modal,
		setModal,
		cargando,
		setCargando,
		setDataToEdit,
		dataToEdit,
	} = useContext(CrudContext);

	const [incentivo, setIncentivo] = useState(incentivoValues);
	const [trabajadores, setTrabajadores] = useState([]);

	const getAllTrabajadores = async () => {
		const response = await getData("incentivo/trabajadores");
		setTrabajadores(response.data);
	};

	useEffect(() => {
		getAllTrabajadores();
	}, []);

	useEffect(() => {
		if (dataToEdit) {
			setIncentivo({
				...dataToEdit,
				teletrans: parseFloat(dataToEdit.pago.teletrans),
				observacion: dataToEdit.pago.observacion,
				fecha_pago: dayjs(dataToEdit.pago.fecha_pago).format(
					"YYYY-MM-DD"
				),
			});
			form.setFieldsValue({
				...dataToEdit,
				teletrans: parseFloat(dataToEdit.pago.teletrans),
				observacion: dataToEdit.pago.observacion,
				fecha_pago: dayjs(dataToEdit.pago.fecha_pago).format(
					"YYYY-MM-DD"
				),
			});
		} else {
			setIncentivo(incentivoValues);
		}
	}, [dataToEdit]);

	const handleData = (e, text) => {
		if (!text && e.target) {
			const { name, value } = e.target;
			form.setFieldsValue({
				[name]: value,
			});
			setIncentivo((values) => {
				return { ...values, [name]: value };
			});
		} else {
			form.setFieldsValue({
				[text]: e,
			});
			setIncentivo((values) => {
				return { ...values, [text]: e };
			});
		}
	};

	const handleSubmit = async () => {
		const route = "pago/programacion";
		setCargando(true);
		const incentivoData = {
			contrato_id: incentivo.contrato_id || "",
			observacion: incentivo.observacion || "",
			fecha_pago: dayjs(incentivo.fecha_pago).format("YYYY-MM-DD") || "",
			teletrans: parseFloat(incentivo.teletrans) || 0,
			tipo: incentivo.tipo || "incentivo",
			id: incentivo.id || "",
		};
		const response = await createData(incentivoData, route);
		if (response) {
			notificacion(response.status, response.msg);
			actualizarTabla();
			closeModal();
		}
	};
	const closeModal = () => {
		setModal(false);
		setDataToEdit(null);
		setCargando(false);
		setIncentivo(incentivoValues);
	};

	const formData = modalIncentivo(incentivo, handleData, trabajadores);

	const [modalTeletrans, setModalTeletrans] = useState(false);
	const handleOpenModalTeletrans = () => {
		setModalTeletrans(true);
	};

	const handleCloseModalTeletrans = () => {
		setModalTeletrans(false);
	};

	return (
		<>
			<ModalButtonTitle
				className={"modal-usuario"}
				title={dataToEdit ? "Editar incentivo" : "Registrar incentivo"}
				open={modal}
				width={400}
				closeModal={closeModal}
				buttonLabel="Juntar Teletrans"
				onClickButton={handleOpenModalTeletrans}
				buttonIcon={<AiOutlineTeam />}
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
			</ModalButtonTitle>
			{modalTeletrans && (
				<ModalJuntarTeletrans
					open={modalTeletrans}
					closeModal={handleCloseModalTeletrans}
					trabajadores={trabajadores}
				/>
			)}
		</>
	);
}
export default ModalIncentivo;
