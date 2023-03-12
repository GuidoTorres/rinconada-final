import React from "react";
import { useContext } from "react";
import { CrudContext } from "../../context/CrudContext";
import { Input, Button } from "antd";
import "./styles/buscadorHistorial.css";

const { Search } = Input;

const BuscadorContrato = ({ abrirModal, registrar, data }) => {
  const { setFilterTextTrabajador } = useContext(CrudContext);

  return (
    <div className="personal-buscador">
      <Search
        placeholder="Ingresa un termino aqui..."
        onChange={(e) => setFilterTextTrabajador(e.target.value)}
        style={{
          width: 300,
        }}
      />
      <div className="button-container">
        <Button onClick={() => abrirModal(true)}>+ Registrar</Button>
      </div>
    </div>
  );
};

export default BuscadorContrato;
