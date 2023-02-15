import { Form, Button } from "antd";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { CrudContext } from "../../../context/CrudContext";
import { modalContratoEmpresa } from "../../../data/FormValues";
import { valuesContrato } from "../../../data/initalValues";
import { notificacion } from "../../../helpers/mensajes";
import MainModal from "../../modal/MainModal";
import { AiOutlineForm } from "react-icons/ai";
import "../styles/modalRegistrarContrato.css";
const ModalRegistrarContrato = ({ actualizarTabla, selected, data }) => {
  const [form] = Form.useForm();

  const route = "contrato";
  const route1 = "cargo";
  const route2 = "campamento";
  const route3 = "gerencia";
  const route4 = "area";
  const route5 = "socio";

  const {
    createData,
    updateData,
    getData,
    modal1,
    setModal1,
    setDataToEdit,
    dataToEdit,
    cargando,
    setCargando,
  } = useContext(CrudContext);

  const [contrato, setContrato] = useState(modalContratoEmpresa);
  const [cargo, setCargo] = useState([]);
  const [campamento, setCampamento] = useState([]);
  const [gerencia, setGerencia] = useState([]);
  const [area, setArea] = useState([]);
  const [socio, setSocio] = useState([]);

  const getAll = async () => {
    const cargoData = await getData(route1);
    const campamentoData = await getData(route2);
    const gerenciaData = await getData(route3);
    const areaData = await getData(route4);
    const socioData = await getData(route5);

    const all = await Promise.all([
      cargoData,
      campamentoData,
      gerenciaData,
      areaData,
      socioData,
    ]);

    setCargo(all[0].data);
    setCampamento(all[1].data);
    setGerencia(all[2].data);
    setArea(all[3].data);
    setSocio(all[4].data);
  };

  useEffect(() => {
    if (dataToEdit) {
      setContrato(dataToEdit);
    } else {
      setContrato(valuesContrato);
    }
  }, [dataToEdit]);

  useEffect(() => {
    getAll();
  }, []);

  const handleData = (e) => {
    const { name, value } = e.target;
    setContrato((values) => {
      return { ...values, [name]: value };
    });

    if (name === "recomendado_por") {
      const prueba = socio.filter((item) => item.nombre === value);
      const cooperativa = prueba.map(
        (item) => (contrato.cooperativa = item.cooperativa)
      );
    }
  };

  const handleSubmit = async (e) => {
    if (dataToEdit === null) {
      setCargando(true);
      const response = await createData(contrato, route);
      if (response) {
        notificacion(response.msg, response.status);
        closeModal();
        actualizarTabla();
        setCargando(false);
      }
    } else {
      setCargando(true);
      const response = await updateData(contrato, selected.id, route);
      if (response) {
        notificacion(response.msg, response.status);
        closeModal();
        actualizarTabla();
        setCargando(false);
      }
    }
  };

  const closeModal = () => {
    setModal1(false);
    setDataToEdit(null);
    setContrato(modalContratoEmpresa);
  };

  const formData = modalContratoEmpresa(
    contrato,
    handleData,
    gerencia,
    cargo,
    campamento,
    socio
  );
  return (
    <MainModal
      className={"modal-contrato-empresa"}
      title={"Registrar contrato"}
      open={modal1}
      width={900}
      closeModal={closeModal}
    >
      <Form
        form={form}
        className="modal-body"
        onFinish={handleSubmit}
        layout="horizontal"
      >
        <div className="contrato">
          {formData.slice(0, 10).map((item, i) => (
            <Form.Item
              className="item"
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
        </div>

        <div className="finalizacion">
          {formData.slice(10, 15).map((item, i) => (
            <Form.Item
              className="item"
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
        </div>

        <Form.Item className="button-container">
          <Button
            htmlType="submit"
            loading={cargando ? true : false}
            icon={<AiOutlineForm />}
          >
            {dataToEdit ? "Editar" : "Registrar"}
          </Button>
        </Form.Item>
      </Form>
    </MainModal>
  );
};

export default ModalRegistrarContrato;
