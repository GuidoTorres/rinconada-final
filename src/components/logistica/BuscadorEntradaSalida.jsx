import React, { useEffect } from "react";
import { useContext } from "react";
import { AiOutlineForm } from "react-icons/ai";
import { CrudContext } from "../../context/CrudContext";
import { Input, Button } from "antd";
import ButtonComponent from "../reusable/ButtonComponent";
const { Search } = Input;

const BuscadorEntradaSalida = ({ abrirModal, modal }) => {
  const { setFilterText, setFilterTextModal } = useContext(CrudContext);

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Search
        placeholder="Ingresa un producto aqui"
        onChange={(e) => setFilterText(e.target.value)}
        style={{
          width: 300,
        }}
      />

      <div className="button-container">
        <ButtonComponent
          text={"Registrar"}
          state={abrirModal}
          icon={<AiOutlineForm />}
        />
      </div>
    </div>
  );
};

export default BuscadorEntradaSalida;
