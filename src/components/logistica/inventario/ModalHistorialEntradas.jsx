import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { CrudContext } from "../../../context/CrudContext";
import {
  entradas,
  productoEntrada,
  productoSalida,
} from "../../../data/dataTable";
import Tabla from "../../tabla/Tabla";
import BuscadorEntradaSalida from "../BuscadorEntradaSalida";
import "../styles/modalEntradaSalida.css";
import ModalRegistrarEntradaSalida from "./ModalRegistrarEntradaSalida";
import { Select, Modal, Button, Empty } from "antd";
import { notificacion } from "../../../helpers/mensajes";

const ModalHistorialEntradas = ({ id, data }) => {
  const {
    setModal1,
    modal1,
    setModal2,
    modal2,
    tipo,
    setTipo,
    getDataById,
    deleteData,

    setDataToEdit,
  } = useContext(CrudContext);
  const [historial, setHistorial] = useState();
  const closeModal = () => {
    setModal1(false);
    setTipo("");
  };

  const getHistorial = async () => {
    const route = `entrada`;
    const routeId = `${id}?tipo=${tipo}`;
    const response = await getDataById(route, routeId);
    setHistorial(response.data);
  };
  useEffect(() => {
    getHistorial();
  }, [tipo]);

  const handleEdit = (e) => {
    setDataToEdit(e);
    setModal2(true);
  };

  const handleDelete = async (e) => {
    const route = "entrada";
    const response = await deleteData(route, e.id);
    if (response.status === 200) {
      notificacion(response.status, response.msg);
      getHistorial();
    }
  };

  const colums1 = productoEntrada(handleEdit, handleDelete);
  const colums2 = productoSalida(handleEdit, handleDelete);

  return (
    <Modal
      className="modal-entradas"
      title={
        tipo === "entrada" ? "Historial de entradas" : "Historial de salidas"
      }
      open={modal1}
      centered
      onCancel={closeModal}
      footer={null}
      width={900}
    >
      <BuscadorEntradaSalida abrirModal={setModal2} modal={true} />

      <br />
      {tipo === "entrada" ? (
        historial?.length > 0 ? (
          <Tabla columns={colums1} table={historial} />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>No hay registros para mostrar.</span>}
          />
        )
      ) : historial?.length > 0 ? (
        <Tabla columns={colums2} table={historial} />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<span>No hay registros para mostrar.</span>}
        />
      )}

      <ModalRegistrarEntradaSalida
        almacen_id={id}
        actualizarTabla={getHistorial}
        productos={data}
      />
    </Modal>
  );
};

export default ModalHistorialEntradas;
