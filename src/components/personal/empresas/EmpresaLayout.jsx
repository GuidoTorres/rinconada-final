import React, { useContext, useEffect, useState } from "react";
import { CrudContext } from "../../../context/CrudContext";
import Header from "../../header/Header";
import Tabla from "../../tabla/Tabla";
import Buscador from "../Buscador";
import ModalRegistrarEmpresa from "./ModalRegistrarEmpresa";
import ModalHistorialContrato from "./ModalHistorialContrato";
import { empresaLayout } from "../../../data/dataTable";
import { notificacion } from "../../../helpers/mensajes";
import useSearch from "../../../hooks/useSearch";
import { Empty } from "antd";

const EmpresaLayout = () => {
  const route = "empresa";

  const {
    getData,
    deleteData,
    setModal,
    modal,
    setModal1,
    modal1,
    setDataToEdit,
  } = useContext(CrudContext);
  const [empresas, setEmpresas] = useState([]);
  const [id, setId] = useState("");

  const { result } = useSearch(empresas);

  const getEmpresa = async () => {
    const response = await getData(route);
    setEmpresas(response.data);
  };

  const handleEdit = (e) => {
    setDataToEdit(e);
    setModal(true);
  };

  const handleDelete = async (e) => {
    const response = await deleteData(route, e);
    if (response) {
      notificacion(response.status, response.msg);
      getEmpresa();
    }
  };

  useEffect(() => {
    getEmpresa();
  }, []);

  const handleContrato = (e) => {
    setModal1(true);
    setId(e);
  };

  const columns = empresaLayout(handleContrato, handleEdit, handleDelete);

  return (
    <>
      <Header text={"Empresas"} user={"Usuario"} ruta={"/personal"} />
      <div className="margenes">
        <Buscador abrirModal={setModal} registrar={true} />

        {result?.length > 0 ? (
          <Tabla columns={columns} table={result} />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>No hay registros para mostrar.</span>}
          />
        )}
      </div>

      {modal && <ModalRegistrarEmpresa actualizarTabla={getEmpresa} />}
      {modal1 && <ModalHistorialContrato selected={id} />}
    </>
  );
};

export default EmpresaLayout;
