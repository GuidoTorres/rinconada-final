import {
	Badge,
	Button,
	Card,
	Col,
	Divider,
	Form,
	Input,
	Row,
	Select,
	Space,
	Tag,
	Typography,
} from "antd";
import { Fragment, useContext, useEffect, useState } from "react";
import { BsCalendar2Check } from "react-icons/bs";
import { CrudContext } from "../../../context/CrudContext";
import MainModal from "../../modal/MainModal";
import "../style/modalPagos.css";
const ModalPago = ({ open, closeModal, data = {} }) => {
	const { Text } = Typography;
	console.log("🚀 ~ file: ModalPago.jsx:6 ~ ModalPago ~ data:", data);
	const [volquetes, setVolquetes] = useState([]);
	console.log(
		"🚀 ~ file: ModalPago.jsx:22 ~ ModalPago ~ volquetes:",
		volquetes
	);

	useEffect(() => {
		if (data?.trabajadores[0]?.teletrans !== null) {
			let arreglo = [];
			for (
				let index = 0;
				index < parseFloat(data?.trabajadores[0]?.teletrans) / 4;
				index++
			) {
				arreglo.push({
					hora: "",
					placa: "",
					propietario: "",
					trapiche: "",
					volquetes: "",
					teletrans: "",
				});
			}
			setVolquetes(arreglo);
		}
	}, [data]);

	const { getData } = useContext(CrudContext);

	const [conductores, setConductores] = useState([]);
	console.log(
		"🚀 ~ file: ModalPago.jsx:53 ~ ModalPago ~ conductores:",
		conductores
	);
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
			setTrapiches(response);
		}
	};

	useEffect(() => {
		getConductores();
		getTrapiches();
	}, []);

	// const [initialValues, setInitialValues] = useState([
	//   {
	//     conductor: "",
	//     dni: "",
	//     telefono: "",
	//     placa: "",
	//     teletrans: "",
	//     lugar: "",
	//     contrato_id: selected?.id,
	//     evaluacion_id: parseInt(evaluacion_id),
	//   },
	// ]);
	// const [pagar, setPagar] = useState();
	// const [pago2, setPago2] = useState([]);
	// const closeModal = () => {
	//   setModal1(false);
	// };
	// console.log('====================================');
	// console.log(data);
	// console.log('====================================');
	// const handleChange = (e, i) => {
	//   let data = [...initialValues];
	//   const { name, value } = e.target;
	//   data[i][name] = value;

	//   setInitialValues(data);
	// };
	// const addFields = () => {
	//   let object = {
	//     conductor: "",
	//     dni: "",
	//     telefono: "",
	//     placa: "",
	//     teletrans: "",
	//     lugar: "",
	//     contrato_id: selected?.id,
	//   };
	//   setInitialValues([...initialValues, object]);
	// };
	// const handleSubmit = async (e) => {
	//   const route = "pago";
	//   const route2 = "pago/multiple";

	//   console.log(initialValues);
	//   e.preventDefault();

	// if (data.asociacion !== null) {
	//   createData(initialValues, route2).then((res) => {
	//     if (res.status) {
	//       alertaExito(res.msg, res.status).then((res) => {
	//         closeModal();
	//         if (res.isConfirmed) {
	//           actualizarTabla();
	//         }
	//       });
	//     }
	//   });
	// } else {
	//   createData(initialValues, route).then((res) => {
	//     if (res.status) {
	//       alertaExito(res.msg, res.status).then((res) => {
	//         closeModal();
	//         if (res.isConfirmed) {
	//           // actualizarTabla();
	//         }
	//       });
	//     }
	//   });
	// }
	// };
	return (
		<MainModal
			className={"modal-pago"}
			title={"Generar pago"}
			open={open}
			width={800}
			closeModal={closeModal}
		>
			<Card
				style={{
					width: "100%",
				}}
			>
				<Row justify="space-between">
					<Col span={8}>
						<Space direction="horizontal">
							<BsCalendar2Check />
							<Text>{data?.fecha_pago}</Text>
						</Space>
					</Col>
					<Col span={8}>
						<Space direction="horizontal">
							<Text>Tipo:</Text>
							{data?.tipo === "casa" ? (
								<Tag color="green">Casa</Tag>
							) : data?.tipo === "incentivo" ? (
								<Tag color="gold">Incentivo</Tag>
							) : data?.tipo === "asociacion" ? (
								<Tag color="purple">Asociación</Tag>
							) : (
								""
							)}
						</Space>
					</Col>
					<Col span={24}>
						<Text strong>Observación: </Text>
						<Text>{data?.observacion}</Text>
					</Col>
				</Row>
			</Card>
			<Card style={{ width: "100%" }}>
				{data?.trabajadores?.map((item, i) => {
					return (
						<Fragment key={i}>
							<Row justify="space-between">
								<Col span={12}>
									<Space direction="horizontal">
										<Text strong>Nombre:</Text>
										<Text>{item?.nombre}</Text>
									</Space>
								</Col>
								<Col span={12}>
									<Space direction="horizontal">
										<Text strong>Dni:</Text>
										<Text>{item?.dni}</Text>
									</Space>
								</Col>
								<Col span={12}>
									<Space direction="horizontal">
										<Text strong>Celular:</Text>
										<Text>{item?.celular}</Text>
									</Space>
								</Col>
								<Col span={12}>
									<Space direction="horizontal">
										<Text strong>Cargo:</Text>
										<Text>{item?.cargo}</Text>
									</Space>
								</Col>
								<Col span={12}>
									<Space direction="horizontal">
										<Text strong>Area:</Text>
										<Text>{item?.area}</Text>
									</Space>
								</Col>
								<Col span={12}>
									<Space direction="horizontal">
										<Text strong>Pago:</Text>
										<Text>{item?.teletrans}</Text>
									</Space>
								</Col>
							</Row>
							{data?.trabajadores?.length !== i + 1 && (
								<Divider />
							)}
						</Fragment>
					);
				})}
			</Card>
			<Divider orientation="left">Vehículo/s</Divider>
			<Form>
				{volquetes.map((item, i) => (
					<Badge.Ribbon key={i} text={`Vehículo ${i + 1}`}>
						<Card style={{ width: "100%" }}>
							<Form.Item
								label="Conductor"
								name={["conductor", i]}
								rules={[
									{
										required: true,
										message:
											"Ingrese el nombre del conductor",
									},
								]}
							>
								<Select
									showSearch
									placeholder="Conductores"
									style={{
										width: "100%",
									}}
									name="nombre"
									onChange={(e) => {}}
									value={""}
									filterOption={(input, option) =>
										(option?.label ?? "")
											.toLowerCase()
											.includes(input.toLowerCase())
									}
									options={conductores.map((item) => ({
										label: item.placa,
										value: item.propietario,
									}))}
								/>
							</Form.Item>
						</Card>
					</Badge.Ribbon>
				))}
			</Form>

			{/* <section className="cabecera">
				<div>
					<label htmlFor="">
						<strong>Nombre:</strong> {data && data?.nombre}
					</label>
				</div>

				<div>
					<label htmlFor="">
						<strong>Dni:</strong> {data && data?.dni}
					</label>
				</div>
				<div>
					<label htmlFor="">
						<strong>Teléfono:</strong> {data && data?.celular}
					</label>
				</div>
				<div>
					<label htmlFor="">
						<strong>Cargo:</strong> {data && data?.cargo}
					</label>
				</div>
			</section> */}
			{/* <section className="button-container">
        {data && data?.asociacion !== null ? (
          <button
            onClick={addFields}
            style={{
              border: "1px solid grey",
              width: "120px",
              height: "30px",
              backgroundColor: "white",
              borderRadius: "6px",
            }}
          >
            Añadir
          </button>
        ) : (
          ""
        )}
      </section> */}
			{/* <form className="form" onSubmit={handleSubmit}>
        {initialValues.map((input, i) => {
          return (
            <>
              <div>
                <label htmlFor="">Hora</label>
                <Input
                  name="hora"
                  type="time"
                  onChange={(e) => handleChange(e, i)}
                />
              </div>

              <div>
                <label htmlFor="">Placa</label>
                <Input
                  name="placa"
                  type="text"
                  onChange={(e) => handleChange(e, i)}
                />
              </div>
              <div>
                <label htmlFor="">Propietario</label>
                <Input
                  name="propietario"
                  type="text"
                  onChange={(e) => handleChange(e, i)}
                />
              </div>

              <div>
                <label htmlFor="">Trapiche</label>
                <Input
                  name="trapiche"
                  type="text"
                  onChange={(e) => handleChange(e, i)}
                />
              </div>
              <div>
                <label htmlFor="">Teletrans</label>
                <Input
                  name="teletrans"
                  type="number"
                  disabled
                  value={data.pago.split(" ")[0]}
                  onChange={(e) => handleChange(e, i)}
                />
              </div>
              <div>
                <label htmlFor="">Tipo de pago</label>
                <Select
                  name="lugar"
                  type="text"
                  onChange={(e) => handleChange(e, i)}
                />
              </div>
            </>
          );
        })}
      </form> */}
			<div className="button-container">
				<Button>Guardar</Button>
			</div>
		</MainModal>
	);
};

export default ModalPago;
