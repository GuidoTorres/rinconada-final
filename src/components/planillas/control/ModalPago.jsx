import React, { useContext, useState } from "react";
import { AiOutlineClose, AiFillEye } from "react-icons/ai";
import { CrudContext } from "../../../context/CrudContext";
import { PlanillaContext } from "../../../context/PlanillaContext";
import MainModal from "../../modal/MainModal";
import "../style/modalPagos.css";
const ModalPago = ({ data, selected, actualizarTabla, evaluacion_id, modal1, setPago }) => {
  const [initialValues, setInitialValues] = useState([
    {
      conductor: "",
      dni: "",
      telefono: "",
      placa: "",
      teletrans: "",
      lugar: "",
      contrato_id: selected?.id,
      evaluacion_id: parseInt(evaluacion_id),
    },
  ]);
  const [pagar, setPagar] = useState();
  const [pago2, setPago2] = useState([]);
  const closeModal = () => {
    setPago(false);
  };
  const handleChange = (e, i) => {
    let data = [...initialValues];
    const { name, value } = e.target;
    data[i][name] = value;

    setInitialValues(data);
  };
  const addFields = () => {
    let object = {
      conductor: "",
      dni: "",
      telefono: "",
      placa: "",
      teletrans: "",
      lugar: "",
      contrato_id: selected?.id,
    };
    setInitialValues([...initialValues, object]);
  };
  const handleSubmit = async (e) => {
    const route = "pago";
    const route2 = "pago/multiple";

    console.log(initialValues);
    e.preventDefault();

    // if (data.asociacion !== null) {
    //   createData(initialValues, route2).then((res) => {
    //     if (res.status) {
    //       alertaExito(res.msg, res.status).then((res) => {
    //         closeModal();
    //         if (res.isConfirmed) {
    //           actualizarTabla();
    //         }
    //       });
    //     }
    //   });
    // } else {
    //   createData(initialValues, route).then((res) => {
    //     if (res.status) {
    //       alertaExito(res.msg, res.status).then((res) => {
    //         closeModal();
    //         if (res.isConfirmed) {
    //           // actualizarTabla();
    //         }
    //       });
    //     }
    //   });
    // }
  };
  return (
    <MainModal
      className={"modal-pago"}
      title={"Generar pago"}
      open={modal1}
      width={800}
      closeModal={closeModal}
    >
      <section className="cabecera">
        <div>
          <label htmlFor="">Nombre: {data && data?.nombre}</label>
        </div>

        <div>
          <div>
            <label htmlFor="">Dni: {data && data?.dni}</label>
          </div>
          <div>
            <label htmlFor="">Teléfono: {data && data?.telefono}</label>
          </div>
          <div>
            <label htmlFor="">Cargo:</label>
          </div>
        </div>
      </section>
      <section className="button-container">
        {data && data?.asociacion !== null ? (
          <button
            onClick={addFields}
            style={{
              border: "1px solid grey",
              width: "120px",
              height: "30px",
              backgroundColor: "white",
              borderRadius: "6px",
            }}
          >
            Añadir
          </button>
        ) : (
          ""
        )}
      </section>
      <form className="form" onSubmit={handleSubmit}>
        {initialValues.map((input, i) => {
          return (
            <section className="body">
              <div className="input-container">
                <div>
                  <label htmlFor="">Conductor</label>
                  <input
                    name="conductor"
                    type="text"
                    onChange={(e) => handleChange(e, i)}
                  />
                </div>

                <div>
                  <label htmlFor="">Dni</label>
                  <input
                    name="dni"
                    type="text"
                    onChange={(e) => handleChange(e, i)}
                  />
                </div>
                <div>
                  <label htmlFor="">Teléfono</label>
                  <input
                    name="telefono"
                    type="text"
                    onChange={(e) => handleChange(e, i)}
                  />
                </div>

                <div>
                  <label htmlFor="">Placa</label>
                  <input
                    name="placa"
                    type="text"
                    onChange={(e) => handleChange(e, i)}
                  />
                </div>
                <div>
                  <label htmlFor="">Teletrans</label>
                  <input
                    name="teletrans"
                    type="text"
                    onChange={(e) => handleChange(e, i)}
                  />
                </div>
                <div>
                  <label htmlFor="">Lugar de Despacho</label>
                  <input
                    name="lugar"
                    type="text"
                    onChange={(e) => handleChange(e, i)}
                  />
                </div>
              </div>
            </section>
          );
        })}
        <div className="footer">
          <button>Guardar</button>
        </div>
      </form>
    </MainModal>
  );
};

export default ModalPago;
