import { Empty } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { CrudContext } from "../../../context/CrudContext";
import { pagosLayout } from "../../../data/dataTable";
import Header from "../../header/Header";
import Tabla from "../../tabla/Tabla";
import BuscadorControlPlanilla from "../BuscadorControlPlanilla";
import ModalHistorialPagos from "./ModalHistorialPagos";

const PagosLayout = () => {
  const { getData } = useContext(CrudContext);
  const [pagos, setPagos] = useState([]);
  const [historialPagos, setHistorialPagos] = useState(false);

  const getPAgos = async () => {
    const response = await getData("planilla/pagos");

    if (response) {
      const filterNull = response.data.filter(item => item !== null)
      setPagos(filterNull);
    }
  };
  useEffect(() => {
    getPAgos();
  }, []);
  console.log(pagos);

  const handlePagos = () => {
    setHistorialPagos(true);
  };

  const columns = pagosLayout(handlePagos);

  return (
    <div>
      <Header text={"Pagos"} ruta={"/planilla"} />
      <div className="margenes">
        <BuscadorControlPlanilla
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

      <ModalHistorialPagos modal={historialPagos} close={setHistorialPagos} />
      {/* {juntarTeletrans && (
        <ModalJuntarTeletrans
        //   selected={tableData}
        //   actualizarTabla={getTrabajadores}
        />
      )} */}
    </div>
  );
};

export default PagosLayout;
