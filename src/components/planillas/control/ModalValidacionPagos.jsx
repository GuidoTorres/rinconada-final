import React, { useContext, useEffect, useState } from "react";
import { CrudContext } from "../../../context/CrudContext";
import { PlanillaContext } from "../../../context/PlanillaContext";
import Tabla from "../../tabla/Tabla";
import Buscador from "../Buscador";
import { tableValidacionPagos } from "../../../data/dataTable";
import useSearch from "../../../hooks/useSearch";
import MainModal from "../../modal/MainModal";
import "../style/modalValidacionPagos.css";

const ModalValidacionPagos = ({ data }) => {
  const { verificacion, setVerificacion } = useContext(PlanillaContext);
  const { getDataById, data2, setData2, modal, setModal } =
    useContext(CrudContext);
  const [text, setText] = useState();
  const { result } = useSearch(data2);
  const getTareo = async () => {
    const route = "planilla/tareo";
    const response = await getDataById(route, data.dni);
    setData2(response.data);
  };
  useEffect(() => {
    getTareo();
  }, []);

  const modalVerificacion = (data) => {
    setVerificacion(true);
    setText(data);
  };

  const closeModal = () => {
    setModal(false);
  };

  const columns = tableValidacionPagos();

  return (
    <MainModal
      className={"modal-validacion"}
      title={"Hoja de tareo"}
      open={modal}
      width={900}
      closeModal={closeModal}
    >
      <Buscador
        registrar={false}
        crear={false}
        exportar={true}
        cargar={false}
      />
      <div>
        <label htmlFor="">
          Nombre:{" "}
          {data && [data].map((item) => (item.nombre ? item.nombre : "----"))}
        </label>
      </div>

      <div style={{ display: "flex", gap: "50px", marginTop: "10px" }}>
        <div>
          <label htmlFor="">
            Dni: {data && [data].map((item) => (item.dni ? item.dni : "----"))}
          </label>
        </div>
        <div>
          <label htmlFor="">
            Teléfono:{" "}
            {data &&
              [data].map((item) => (item.telefono ? item.telefono : "----"))}
          </label>
        </div>
        {/* <div>
                  <label htmlFor="">Cargo:</label>
                </div> */}

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: "5px",
            gap: "150px",
          }}
        ></div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="">
            Total de días asistidos:{" "}
            {data2.filter((item) => item.asistencia === "Asistio").length}
          </label>
        </div>
      </div>
      <Tabla columns={columns} table={result} />

      {/* <section
        style={{
          paddingLeft: "30px",
          display: "flex",
          gap: 20,
          paddingRight: "30px",
          marginBottom: "20px",
        }}
      >
        <button
          style={{
            padding: "10px",
            backgroundColor: "white",
            borderRadius: "6px",
            border: "1px solid grey",
          }}
          onClick={() => modalVerificacion("Verificación Gerente de Op.")}
        >
          Verificación Gerente de Op.
        </button>
        <button
          style={{
            padding: "10px",
            backgroundColor: "white",
            borderRadius: "6px",
            border: "1px solid grey",
          }}
          onClick={() => modalVerificacion("Verificación Jefe de Operaciones")}
        >
          Verificación Jefe de Operaciones
        </button>
        <button
          style={{
            padding: "10px",
            backgroundColor: "white",
            borderRadius: "6px",
            border: "1px solid grey",
          }}
          onClick={() => modalVerificacion("Validacion de Trabajador")}
        >
          Validacion de Trabajador
        </button>
      </section> */}
    </MainModal>
  );
};

export default ModalValidacionPagos;
