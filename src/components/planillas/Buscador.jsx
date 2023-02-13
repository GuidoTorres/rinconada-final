import React from "react";
import { useContext, useRef } from "react";
import { CrudContext } from "../../context/CrudContext";
import { PlanillaContext } from "../../context/PlanillaContext";
import { Input, Button, Radio } from "antd";
import { notificacion } from "../../helpers/mensajes";
import "./style/buscador.css";
const { Search } = Input;

const Buscador = ({
  abrirModal,
  registrar,
  crear,
  exportar,
  cargar,
  actualizarTabla,
  actualizarAsistencia,
  actualizar,
  buscador, cargando, setCargando
}) => {
  const { createData, setFilterText } = useContext(CrudContext);
  const { setControlAsistencia } = useContext(PlanillaContext);
  const inputFileRef = useRef(null);

  const handleModal = () => {
    abrirModal(true);
  };



  const changeHandler = (e) => {
    inputFileRef.current.click();
  };

  const excelFile = async (e) => {
    let formData = new FormData();
    formData.append("myFile", e.target.files[0]);
    const excel = await fetch(
      `${import.meta.env.VITE_APP_BASE}/asistencia/excel`,
      {
        method: "post",
        body: formData,
      }
    );
    const response = await excel.json();
    if (response) {
      notificacion(response.status, response.msg);
      actualizar();
      actualizarTabla();
      setControlAsistencia(false);
    }

    inputFileRef.current.value = null;
  };

  return (
    <div
      className="buscador-container"
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <input
        type="file"
        ref={inputFileRef}
        onChange={excelFile}
        style={{ display: "none" }}
      />
      {buscador ? (
        <Search
          placeholder="Ingresa una fecha..."
          onChange={(e) => setFilterText(e.target.value)}
          style={{
            width: 300,
          }}
        />
      ) : (
        <div>
          {registrar !== false ? (
            <Button onClick={handleModal} style={{ width: "100px" }}>
              Registrar
            </Button>
          ) : (
            ""
          )}
          {exportar !== false ? (
            <Button
              onClick={excelFile}
              style={{ width: "100px" }}
              loading={cargando ? true : false}
            >
              Exportar{" "}
            </Button>
          ) : (
            ""
          )}
          {cargar !== false ? (
            <Button style={{ width: "100px" }} onClick={changeHandler}>
              Cargar
            </Button>
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
};

export default Buscador;
