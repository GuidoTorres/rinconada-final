import React, { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { AiOutlineClose, AiFillEye } from "react-icons/ai";
import { PlanillaContext } from "../../../context/PlanillaContext";
import Tabla from "../../tabla/Tabla";
import Buscador from "../Buscador";
import "../style/modalPlanillaControl.css";
import ModalPago from "./ModalPago";
import ModalValidacionPagos from "./ModalValidacionPagos";
import ModalValidacionPagosAsociacion from "./ModalValidacionPagosAsociacion";
import { tablePlanillaControl } from "../../../data/dataTable";
import MainModal from "../../modal/MainModal";
import { CrudContext } from "../../../context/CrudContext";

const ModalPlanillaControl = ({ selected, actualizarTabla }) => {
  const [contrato, setContrato] = useState([]);
  const [dataSelected, setDataSelected] = useState([]);
  const {
    setPlanillaControl,
    validacionPagos,
    setValidacionPagos,
    pago,
    setPago,
    validacionPagosAsociacion,
    setValidacionPagosAsociacion,
    planillaControl,
    
  } = useContext(PlanillaContext);
  const {modal, setModal} = useContext(CrudContext)
  const closeModal = () => {
    setPlanillaControl(false);
  };

  useEffect(() => {
    setContrato([selected]);
  }, [selected]);

  console.log('====================================');
  console.log(selected);
  console.log('====================================');

  const handleValidacion = () => {
    if (selected.codigo) {
      setValidacionPagosAsociacion(true);
    } else {
      setModal(true);
    }
  };

  const handlePagos = (e) => {
    setPago(true);
    setDataSelected(e);
  };

  const columns = tablePlanillaControl(handleValidacion, handlePagos);

  return (
    <MainModal
      className={"modal-planilla"}
      title={"Control de planilla"}
      open={planillaControl}
      width={900}
      closeModal={closeModal}
    >
      <Tabla columns={columns} table={contrato} />

      {modal && <ModalValidacionPagos data={selected} />}
      {validacionPagosAsociacion && (
        <ModalValidacionPagosAsociacion data={selected} />
      )}
      {pago && (
        <ModalPago
          data={selected}
          selected={dataSelected}
          evaluacion_id={selected.evaluacion_id}
          actualizarTabla={actualizarTabla}
        />
      )}
    </MainModal>
  );
};

export default ModalPlanillaControl;
