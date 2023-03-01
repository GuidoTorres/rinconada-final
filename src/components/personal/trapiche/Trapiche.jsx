import React, { useContext, useEffect, useState } from "react";
import { CrudContext } from "../../../context/CrudContext";
import { trapicheLayout } from "../../../data/dataTable";
import Header from "../../header/Header";
import Tabla from "../../tabla/Tabla";
import BuscadorTrapiche from "../BuscadorTrapiche";
import ModalTrapiche from "./ModalTrapiche";

const Trapiche = () => {
  const { getData, modal, setModal } = useContext(CrudContext);
  const [trapiches, setTrapiches] = useState([]);

  const getTrapiche = async () => {
    const response = await getData("trapiche");
    setTrapiches(response.data);
  };
  useEffect(() => {
    getTrapiche();
  }, []);

  const handleEdit = () => {};
  const handleDelete = () => {};

  const columns = trapicheLayout(handleEdit, handleDelete);
  return (
    <>
      <Header text={"Trapiches"} user={"Usuario"} ruta={"/personal"} />
      <div className="margenes">
        <BuscadorTrapiche abrirModal={setModal} />
        <Tabla columns={columns} table={trapiches} />
      </div>

      {modal && <ModalTrapiche actualizarTabla={getTrapiche}/>}
    </>
  );
};

export default Trapiche;
