import React from "react";
import { useContext } from "react";
import { CrudContext } from "../../context/CrudContext";
import { Input, Button } from "antd";
import "./styles/buscadorHistorial.css";

const { Search } = Input;

const BuscadorContrato = ({ abrirModal, registrar, data }) => {
  const { setFilterText } = useContext(CrudContext);

  return (
    <div className="personal-buscador">
      <Search
        placeholder="Ingresa un termino aqui..."
        onChange={(e) => setFilterText(e.target.value)}
        style={{
          width: 300,
        }}
      />
      <div className="button-container">
        {Object.keys(data?.contrato)?.length === 0 ||
        (data?.contrato?.at(-1)?.finalizado &&
          data?.evaluacion?.at(-1)?.finalizado === false &&
          data?.evaluacion?.at(-1)?.fiscalizador_aprobado === "si" &&
          data?.evaluacion?.at(-1)?.control === "si" &&
          data?.evaluacion?.at(-1)?.topico === "si" &&
          data?.evaluacion?.at(-1)?.seguridad === "si" &&
          data?.evaluacion?.at(-1)?.medio_ambiente === "si" &&
          data?.evaluacion?.at(-1)?.recursos_humanos === "si") ? (
          <Button onClick={() => abrirModal(true)}>+ Registrar</Button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default BuscadorContrato;
