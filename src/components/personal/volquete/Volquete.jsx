import React, { useContext, useEffect, useState } from "react";
import { CrudContext } from "../../../context/CrudContext";
import { volqueteLayout } from "../../../data/dataTable";
import Header from "../../header/Header";
import Tabla from "../../tabla/Tabla";
import BuscadorTrapiche from "../BuscadorTrapiche";
import ModalVolquete from "./ModalVolquete";

const Volquete = () => {
  const { getData, modal, setModal } = useContext(CrudContext);
  const [volquete, setVolquete] = useState([]);

  const getVolquetes = async () => {
    const response = await getData("volquete");
    setVolquete(response.data);
  };

  useEffect(() => {
    getVolquetes();
  }, []);

  const handleEdit = () => {};
  const handleDelete = () => {};

  const columns = volqueteLayout(handleEdit, handleDelete);

  return (
    <>
      <Header text={"Volquetes"} user={"Usuario"} ruta={"/personal"} />
      <div className="margenes">
        <BuscadorTrapiche abrirModal={setModal} />
        <Tabla columns={columns} table={volquete} />
      </div>

      {modal && <ModalVolquete actualizarTabla = {getVolquetes}/>}
    </>
  );
};

export default Volquete;
