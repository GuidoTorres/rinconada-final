import React, { useContext, useEffect, useState } from "react";
import { CrudContext } from "../../../context/CrudContext";
import { PlanillaContext } from "../../../context/PlanillaContext";
import Header from "../../header/Header";
import ModalPlanillaControl from "./ModalPlanillaControl";
import { controlPlanilla } from "../../../data/dataTable";
import BuscadorControlPlanilla from "../BuscadorControlPlanilla";
import useSearch from "../../../hooks/useSearch";
import TablaPlanilla from "../../tabla/TablaPlanilla";
import { Button, Empty, Input, Select } from "antd";
import { handleDownloadExcel } from "../../../helpers/tablaExcel";

const ControlPlanilla = () => {
  const { planillaControl, setPlanillaControl, setUserdata } =
    useContext(PlanillaContext);
  const { getData, setData, data, setResult } = useContext(CrudContext);
  const [tableData, setTableData] = useState([]);
  const [area, setArea] = useState([]);
  const [cargo, setCargo] = useState([]);
  const [campamento, setCampamento] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [filtros, setFiltros] = useState({});
  const { result } = useSearch(data);

  const getTrabajadores = async () => {
    const route = "planilla";
    const route1 = "area";
    const route2 = "cargo";
    const route3 = "campamento";
    const response = getData(route);
    const response1 = getData(route1);
    const response2 = getData(route2);
    const response3 = getData(route3);

    const all = await Promise.all([response, response1, response2, response3]);
    console.log(all[0].data);
    setData(all[0].data);
    setArea(all[1].data);
    setCargo(all[2].data);
    setCampamento(all[3].data);
  };

  useEffect(() => {
    getTrabajadores();
  }, []);

  useEffect(() => {
    if (filtros.campamento) {
      const filter = data?.filter(
        (item) => item?.campamento === filtros.campamento
      );
      setResult(filter);
    }
    if (filtros.area) {
      const filter = data?.filter(
        (item) => item?.contratos?.area === filtros.area
      );
      setResult(filter);
    }

    if (filtros.puesto) {
      const filter = data?.filter((item) =>  item?.puesto === filtros.puesto );

      setResult(filter);
    }
  }, [filtros]);

  const handleContrato = (e) => {
    setPlanillaControl(true);
    setTableData(e);
    setUserdata(e);
  };

  const handleFilters = (e, text) => {
    setFiltros((values) => {
      return { ...values, [text]: e };
    });
  };
  const columns = controlPlanilla(handleContrato);

  console.log(result);

  return (
    <div>
      <Header text={"Planilla"} user={"Usuario"} ruta={"/planilla"} />
      <div className="margenes">
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <BuscadorControlPlanilla
            registrar={false}
            crear={false}
            exportar={false}
            cargar={false}
          />
          <Select
            name="campamento"
            placeholder="Campamento"
            onChange={(e) => handleFilters(e, "campamento")}
            style={{ width: "200px" }}
            options={campamento.map((item) => {
              return { id: item.id, value: item.nombre };
            })}
          />
          <Select
            name="area"
            placeholder="Área"
            onChange={(e) => handleFilters(e, "area")}
            style={{ width: "200px" }}
            options={area.map((item) => {
              return { id: item.id, value: item.nombre };
            })}
          />
          <Select
            name="puesto"
            placeholder="Puesto"
            onChange={(e) => handleFilters(e, "puesto")}
            style={{ width: "200px" }}
            options={cargo.map((item) => {
              return (
                { label: "Ninguno", value: "-1" },
                { id: item.id, value: item.nombre }
              );
            })}
          />
          <Button
            onClick={() => handleDownloadExcel(result, "Planilla", "reporte")}
          >
            {" "}
            Descargar
          </Button>
        </div>
        {result?.length > 0 ? (
          <>
            <TablaPlanilla columns={columns} table={result} />
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>No hay registros para mostrar.</span>}
          />
        )}
      </div>

      {planillaControl && (
        <ModalPlanillaControl
          selected={tableData}
          actualizarTabla={getTrabajadores}
        />
      )}
    </div>
  );
};

export default ControlPlanilla;
