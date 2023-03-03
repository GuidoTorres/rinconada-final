import { Empty } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { CrudContext } from "../../../context/CrudContext";
import { PlanillaContext } from "../../../context/PlanillaContext";
import { pagosLayout } from "../../../data/dataTable";
import { notificacion } from "../../../helpers/mensajes";
import Header from "../../header/Header";
import Tabla from "../../tabla/Tabla";
import BuscadorControlPlanilla from "../BuscadorControlPlanilla";
import ModalJuntarTeletrans from "../control/ModalJuntarTeletrans";

const PagosLayout = () => {
  const { getData, createData } = useContext(CrudContext);
  const { juntarTeletrans, setJuntarTeletrans } = useContext(PlanillaContext);
  const [pagos, setPagos] = useState([]);

  const getPAgos = async () => {
    const response = await getData("planilla/pagos");
    if (response) {
      setPagos(response.data);
    }
  };

  useEffect(() => {
    getPAgos();
  }, []);

  const handleData = (event, e, i) => {
    const { name, value } = event.target;
    console.log(pagos);
    setPagos((state) =>
      state.map((item, index) =>
        index === i
          ? {
              ...item,
              [name]: value,
              contrato_id: e?.contrato_id,
              id: e?.pagos?.pagos?.at(-1)?.id || "",
            }
          : item
      )
    );
  };

  const postPagos = async (e) => {
    const info = {
      id: e?.pago_id || "",
      contrato_id: e?.contrato_id,
      observacion: e?.observacion,
      fecha_pago: e?.fecha_pago,
      teletrans: e?.teletrans,
    };

    const response = await createData(info, "pago/programacion");

    if (response) {
      notificacion(response.status, response.msg);
      getPAgos();
    }
  };

  const columns = pagosLayout(handleData, postPagos);

  return (
    <div>
      <Header text={"Programación de pagos"} ruta={"/planilla"} />
      <div className="margenes">
        <BuscadorControlPlanilla
          abrirModal={setJuntarTeletrans}
          registrar={true}
          crear={false}
          exportar={false}
          cargar={false}
        />
        {pagos?.length > 0 ? (
          <Tabla columns={columns} table={pagos} />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>No hay registros para mostrar.</span>}
          />
        )}
      </div>

      {juntarTeletrans && (
        <ModalJuntarTeletrans
          open={juntarTeletrans}
          //   selected={tableData}
          //   actualizarTabla={getTrabajadores}
        />
      )}
    </div>
  );
};

export default PagosLayout;
