import React, { useContext, useEffect, useState } from "react";
import { CrudContext } from "../../../context/CrudContext";
import { historialPago } from "../../../data/dataTable";
import MainModal from "../../modal/MainModal";
import TablaPlanilla from "../../tabla/TablaPlanilla";
import ModalPago from "../control/ModalPago";

const ModalHistorialPagos = ({ modal, close }) => {
  const [data, setData] = useState([]);
  const [pago, setPago] = useState(false);
  const { getData } = useContext(CrudContext);

  const getTrabajadores = async () => {
    const route = "planilla";
    const response = await getData(route);
    setData(response.data);
  };
  useEffect(() => {
    getTrabajadores();
  }, []);
  const closeModal = () => {
    close(false);
  };

  const handlePago = () => {
    setPago(true);
  };

  const columns = historialPago(handlePago);

  return (
    <MainModal
      className={"modal-usuario"}
      title={"Historial de pagos"}
      open={modal}
      width={900}
      closeModal={closeModal}
    >
      <TablaPlanilla columns={columns} table={data} />
      {pago && <ModalPago modal1={pago}  setPago={setPago}/>}
    </MainModal>
  );
};

export default ModalHistorialPagos;
