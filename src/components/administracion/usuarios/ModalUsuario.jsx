import React, { useContext, useState } from "react";
import { usuarioValues } from "../../../data/initalValues";
import { useEffect } from "react";
import { CrudContext } from "../../../context/CrudContext";
import MainModal from "../../modal/MainModal";
import { Button, Form } from "antd";
import { modalUsuario } from "../../../data/FormValues";
import { notificacion } from "../../../helpers/mensajes";
import { AiOutlineForm } from "react-icons/ai";
import "../styles/modalUsuario.css";

const ModalUsuario = ({ actualizarTabla }) => {
  const [form] = Form.useForm();
  const route = "usuario";

  const {
    createData,
    updateData,
    modal,
    setModal,
    setDataToEdit,
    dataToEdit,
    getData,
    cargando,
    setCargando,
  } = useContext(CrudContext);
  const [usuario, setUsuario] = useState(usuarioValues);
  const [rol, setRol] = useState([]);
  const [cargo, setCargo] = useState([]);

  const getAll = async () => {
    const response = await getData("rol");
    const response1 = await getData("cargo");
    const all = await Promise.all([response, response1]);
    setRol(all[0].data);
    setCargo(all[1].data);
  };

  useEffect(() => {
    getAll();
  }, []);

  useEffect(() => {
    if (dataToEdit) {
      setUsuario(dataToEdit);
      form.setFieldsValue(dataToEdit);
    } else {
      setUsuario(usuarioValues);
    }
  }, [dataToEdit]);

  const handleData = (e, text) => {
    if (!text && e.target) {
      const { name, value } = e.target;
      form.setFieldsValue({
        [name]: value,
      });
      setUsuario((values) => {
        return { ...values, [name]: value };
      });
    } else {
      form.setFieldsValue({
        [text]: e,
      });
      setUsuario((values) => {
        return { ...values, [text]: e };
      });
    }
  };

  const handleSubmit = async (e) => {
    if (dataToEdit === null) {
      setCargando(true);
      const response = await createData(usuario, route);
      if (response) {
        notificacion(response.status, response.msg);
        actualizarTabla();
        closeModal();
      }
    }
    if (dataToEdit) {
      setCargando(true);
      const response = await updateData(usuario, dataToEdit.id, route);
      if (response) {
        notificacion(response.status, response.msg);
        actualizarTabla();
        closeModal();
      }
    }
  };

  function closeModal() {
    setModal(false);
    setDataToEdit(null);
    setUsuario(usuarioValues);
  }

  const formData = modalUsuario(usuario, handleData, rol, cargo, dataToEdit);
  return (
    <MainModal
      className={"modal-usuario"}
      title={dataToEdit ? "Editar usuario" : "Registrar usuario"}
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
            {dataToEdit ? " Editar" : " Registrar"}
          </Button>
        </Form.Item>
      </Form>
    </MainModal>
  );
};

export default ModalUsuario;
