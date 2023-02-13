import { Empty } from "antd";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { CrudContext } from "../../../context/CrudContext";
import { categoriaLayout } from "../../../data/dataTable";
import { notificacion } from "../../../helpers/mensajes";
import useSearch from "../../../hooks/useSearch";
import Header from "../../header/Header";
import Tabla from "../../tabla/Tabla";
import BuscadorEntradaSalida from "../BuscadorEntradaSalida";
import ModalRegistrarCategoria from "./ModalRegistrarCategoria";

const CategoriaLayout = () => {
  const { getData, modal, setModal, setDataToEdit, deleteData } =
    useContext(CrudContext);
  const [categoria, setCategoria] = useState([]);
  const { result } = useSearch(categoria);

  const getCategorias = async () => {
    const route = "categoria";
    const response = await getData(route);
    setCategoria(response.data);
  };

  useEffect(() => {
    getCategorias();
  }, []);

  const handleEdit = (e) => {
    setDataToEdit(e);
    setModal(true);
  };

  const handleDelete = async (e) => {
    const route = "categoria";
    const response = await deleteData(route, e.id);
    if (response) {
      notificacion(response.status, response.msg);
      getCategorias();
    }
  };

  const columns = categoriaLayout(handleEdit, handleDelete);

  return (
    <>
      <Header text={"Categorías"} user={"Usuario"} ruta={"/logistica"} />
      <div className="margenes">
        <BuscadorEntradaSalida abrirModal={setModal} categoria={true}/>

        {result?.length > 0 ? (
        <Tabla columns={columns} table={result} />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>No hay registros para mostrar.</span>}
          />
        )}
      </div>
      {modal && <ModalRegistrarCategoria actualizarTabla={getCategorias} />}
    </>
  );
};

export default CategoriaLayout;
