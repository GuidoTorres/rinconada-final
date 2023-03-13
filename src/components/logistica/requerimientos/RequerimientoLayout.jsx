import { Empty } from "antd";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { CrudContext } from "../../../context/CrudContext";
import {
  pedidoLayout,
  requerimientoLayout,
  requerimientoTable,
} from "../../../data/dataTable";
import Header from "../../header/Header";
import TablaExpandibleTransferencia from "../../tabla/TablaExpandibleTransferencia";
import TablaRequerimientos from "../../tabla/TablaRequerimientos";
import BuscadorRequerimiento from "../BuscadorRequerimiento";
import ModalRequerimiento from "../inventario/ModalRequerimiento";
import ModalGenerarPedido from "./ModalGenerarPedido";

const RequerimientoLayout = () => {
  const {
    getData,
    data,
    setData,
    dataToEdit,
    setDataToEdit,
    modal,
    setMultipleRequerimientos,
    updateData,
    modal3,
    setModal3,
  } = useContext(CrudContext);

  const [requerimientos, setRequerimientos] = useState([]);
  const [pedido, setPedido] = useState([]);
  const [json, setJson] = useState([]);
  const [pdf, setPdf] = useState(false);

  const getRequerimiento = async () => {
    const route = "requerimiento";
    const route1 = "pedido";
    const response = await getData(route);
    const response1 = await getData(route1);
    setRequerimientos(response.data);
    setPedido(response1.data);
  };

  useEffect(() => {
    if (requerimientos.length > 0) {
      let obj = {
        fecha: new Date().toLocaleString("es").split(",")[0],
        estado: "Pendiente",
        req_id: requerimientos.map((item) => item.id),
      };

      setMultipleRequerimientos(obj);
    }
  }, [requerimientos]);

  useEffect(() => {
    getRequerimiento();
  }, []);

  const handleDelete = (e) => {
    console.log(e);
  };

  const updatePedido = async (e, i) => {
    const route = "pedido";
    const info = {
      [e.target.name]: e.target.value,
    };

    const response = await updateData(info, i.id, route);
    if (response.status === 200) {
      // getAprobacion();
    }
  };

  const handleEdit = (e) => {
    setModal3(true);
    setDataToEdit(e);
  };

  const columns = requerimientoLayout(handleEdit, handleDelete);
  const pedidoColumns = pedidoLayout(updatePedido, handleDelete);

  return (
    <>
      <Header text={"Requerimientos"} user={"Usuario"} ruta={"/logistica"} />
      <br />
      <br />
      <div style={{ display: "flex" }}>
        <div style={{ flex: "1" }}>
          <label htmlFor="" style={{ marginLeft: "20px" }}>
            <strong>Requerimientos</strong>{" "}
          </label>
          <div className="margenes">
            <BuscadorRequerimiento generar={true} data={requerimientos} />

            <TablaRequerimientos
              columns={columns}
              table={requerimientos}
              set={setRequerimientos}
            />
          </div>
        </div>
        <br />
        <div style={{ flex: "1" }}>
          <label htmlFor="" style={{ marginLeft: "20px" }}>
            <strong>Pedidos</strong>
          </label>

          <div className="margenes">
            <BuscadorRequerimiento generar={false} />

            {pedido?.length > 0 ? (
              <TablaExpandibleTransferencia
                columns={pedidoColumns}
                table={pedido}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<span>No hay registros para mostrar.</span>}
              />
            )}
          </div>
        </div>
      </div>

      {modal && <ModalGenerarPedido actualizarTabla={getRequerimiento} />}
      {modal3 && <ModalRequerimiento actualizarTabla={getRequerimiento} />}
    </>
  );
};

export default RequerimientoLayout;
