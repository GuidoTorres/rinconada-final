import { Calendar } from "antd";
import React, { useContext, useState } from "react";
import Header from "../../header/Header";
import dayjs from "dayjs";
import { CrudContext } from "../../../context/CrudContext";
import ModalRealizaPago from "../pagos/ModalRealizaPago";

const GenerarPago = () => {
  const { getData, setModal, modal } = useContext(CrudContext);
  const [fechaPago, setFechaPago] = useState("");
  const [data, setData] = useState([]);

  const getFechaPago =  async (fecha) => {

    const route = `pago?fecha=${fecha}`;
    const response = await getData(route);

    if (response.data.length > 0) {
      setData(response.data);
      setModal(true);
    }
  }

  const onSelect = async (e) => {
    const fecha = dayjs(e).format("YYYY-MM-DD");
    setFechaPago(fecha);

    getFechaPago(fecha)

  };
  return (
    <>
      <Header text={"Realizar pagos"} ruta={"/planilla"} />
      <div className="margenes">
        <Calendar fullscreen={true} onChange={onSelect} />
      </div>
      {modal && <ModalRealizaPago fecha={fechaPago} data={data} actualizarTabla={getFechaPago}/>}
    </>
  );
};

export default GenerarPago;
