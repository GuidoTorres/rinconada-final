import { Button, Input, Select } from "antd";
import React, { useContext, useState } from "react";
import { CrudContext } from "../../../context/CrudContext";

import MainModal from "../../modal/MainModal";
import "../style/modalPagos.css";
const ModalPago = ({
  data,
  selected,
  actualizarTabla,
  evaluacion_id,
  setPago,
}) => {
  const {modal1, setModal1} = useContext(CrudContext)
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
    setModal1(false);
  };
  console.log('====================================');
  console.log(data);
  console.log('====================================');
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
          <label htmlFor=""><strong>Nombre:</strong> {data && data?.nombre}</label>
        </div>

        <div>
          <label htmlFor=""><strong>Dni:</strong> {data && data?.dni}</label>
        </div>
        <div>
          <label htmlFor=""><strong>Teléfono:</strong> {data && data?.celular}</label>
        </div>
        <div>
          <label htmlFor=""><strong>Cargo:</strong> {data && data?.cargo}</label>
        </div>
      </section>
      {/* <section className="button-container">
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
      </section> */}
      <form className="form" onSubmit={handleSubmit}>
        {initialValues.map((input, i) => {
          return (
            <>
              <div>
                <label htmlFor="">Hora</label>
                <Input
                  name="hora"
                  type="time"
                  onChange={(e) => handleChange(e, i)}
                />
              </div>

              <div>
                <label htmlFor="">Placa</label>
                <Input
                  name="placa"
                  type="text"
                  onChange={(e) => handleChange(e, i)}
                />
              </div>
              <div>
                <label htmlFor="">Propietario</label>
                <Input
                  name="propietario"
                  type="text"
                  onChange={(e) => handleChange(e, i)}
                />
              </div>

              <div>
                <label htmlFor="">Trapiche</label>
                <Input
                  name="trapiche"
                  type="text"
                  onChange={(e) => handleChange(e, i)}
                />
              </div>
              <div>
                <label htmlFor="">Teletrans</label>
                <Input
                  name="teletrans"
                  type="number"
                  disabled
                  value={data.pago.split(" ")[0]}
                  onChange={(e) => handleChange(e, i)}
                />
              </div>
              <div>
                <label htmlFor="">Tipo de pago</label>
                <Select
                  name="lugar"
                  type="text"
                  onChange={(e) => handleChange(e, i)}
                />
              </div>
            </>
          );
        })}
      </form>
      <div className="button-container">
        <Button>Guardar</Button>
      </div>
    </MainModal>
  );
};

export default ModalPago;
