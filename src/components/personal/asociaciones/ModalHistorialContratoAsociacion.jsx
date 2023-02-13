import React, { useContext, useEffect, useState } from "react";
import Tabla from "../../tabla/Tabla";
import BuscadorEvaluacion from "../BuscadorEvaluacion";
import { AiFillEdit } from "react-icons/ai";
import { BsFillTrash2Fill } from "react-icons/bs";
import "../styles/modalHistorialContrato.css";
import { CrudContext } from "../../../context/CrudContext";
import ModalContratoAsociacion from "./ModalContratoAsociacion";
import { notificacion } from "../../../helpers/mensajes";
import MainModal from "../../modal/MainModal";
import { Empty } from "antd";

const ModalHistorialContratoAsociacion = ({
  selected,
  evaluaciones,
  actualizarAsociacion,
  modal1,
  setModal1,
}) => {
  const {
    getDataById,
    deleteData,
    data1,
    setData1,

    setDataToEdit,
    modal2,
    setModal2,
  } = useContext(CrudContext);
  const [id, setId] = useState("");
  const [modalContrato, setModalContrato] = useState(false);

  const getContrato = async () => {
    const route = "contrato/asociacion";
    const response = await getDataById(route, selected.id);
    setData1(response.data);
  };

  const handleEdit = (e) => {
    setDataToEdit(e);
    setModalContrato(true);
    setId(e.contratoId);
  };

  const handleDelete = async (id) => {
    let route = "contrato";
    const response = await deleteData(route, id.id);
    if (response) {
      notificacion(response.status, response.msg);
      getContrato();
    }
  };

  const closeModal = () => {
    setModal1(false);
    setDataToEdit(null);
  };

  useEffect(() => {
    getContrato();
  }, []);

  const historialContrato = [
    {
      id: "Id contrato",
      name: "Id contrato",
      selector: (row) => row?.id,
    },
    {
      id: "Tipo de Contrato",
      name: "Tipo de Contrato",
      selector: (row) => row?.tipo_contrato,
    },
    {
      id: "Fecha de inicio",
      name: "Fecha de inicio",
      selector: (row) => row?.fecha_inicio?.split("T")[0],
    },
    {
      id: "Fecha de fin",
      name: "Fecha de fin",
      selector: (row) => row?.fecha_fin?.split("T")[0],
    },
    {
      id: "Estado",
      name: "Estado",
      selector: (row) => (row?.estado ? "Finalizado" : "Pendiente"),
    },
    {
      id: "Nota",
      name: "Nota",
      selector: (row) => row?.nota_contrato,
    },
    {
      id: "Acciones",
      name: "Acciones",
      button: true,
      cell: (e) => (
        <>
          <AiFillEdit onClick={() => handleEdit(e)} />
          <BsFillTrash2Fill onClick={() => handleDelete(e)} />
        </>
      ),
    },
  ];
  return (
    <MainModal
      title={"Historial de contratos"}
      open={modal1}
      width={800}
      closeModal={closeModal}
    >
      <BuscadorEvaluacion abrirModal={setModalContrato} registrar={true} />

      {data1.length > 0 ? (
        <section className="tabla">
          <Tabla columns={historialContrato} table={data1} />
        </section>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<span>No hay registros para mostrar.</span>}
        />
      )}

      {modalContrato && (
        <ModalContratoAsociacion
          actualizarTabla={getContrato}
          selected={id}
          data={selected}
          evaluaciones={evaluaciones}
          actualizarAsociacion={actualizarAsociacion}
          modal2={modalContrato}
          setModal2={setModalContrato}
        />
      )}
    </MainModal>
  );
};

export default ModalHistorialContratoAsociacion;
