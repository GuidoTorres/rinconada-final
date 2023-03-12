import React, { useContext } from "react";
import { useEffect } from "react";
import { CrudContext } from "../../../context/CrudContext";
import { inventario } from "../../../data/dataTable";
import Header from "../../header/Header";
import Tabla from "../../tabla/Tabla";
import Buscador from "../Buscador";
import ModalRegistrarProducto from "./ModalRegistrarProducto";
import "../styles/inventarioLayout.css";
import ModalHistorialEntradas from "./ModalHistorialEntradas";
import { useState } from "react";
import ModalRequerimiento from "./ModalRequerimiento";
import useSearch from "../../../hooks/useSearch";
import { Select, Modal, Empty } from "antd";
import { notificacion } from "../../../helpers/mensajes";

const InventarioLayout = () => {
  const {
    getData,
    setData,
    data,
    data1,
    setData1,
    modal,
    setModal,
    setDataToEdit,
    modal1,
    setModal1,
    getDataById,
    deleteData,
    modal3,
    setModal3,
  } = useContext(CrudContext);

  const [almacen_id, setAlmacen_id] = useState("");

  const getAlmacen = async () => {
    const response = await getData("almacen");
    setData(response.data);
  };

  console.log('====================================');
  console.log(almacen_id);
  console.log('====================================');

  const getProductoAlmacen = async () => {
    const response = await getData(`almacen/producto/${almacen_id}`);
    setData1(response.data);
  };

  const { result } = useSearch(data1);

  useEffect(() => {
    getProductoAlmacen();
  }, [almacen_id]);

  useEffect(() => {
    getAlmacen();
  }, []);

  const handleEdit = (e) => {
    setDataToEdit(e);
    setModal(true);
  };
  const handleDelete = async (e) => {
    const route = "producto";

    const response = await deleteData(route, e);
    if (response) {
      notificacion(response.status, response.msg);
      getProductoAlmacen();
    }
  };


  const columns = inventario(handleEdit, handleDelete);

  return (
    <>
      <Header text={"Inventario"} user={"Usuario"} ruta={"/logistica"} />

      <div className="selector" style={{ padding: "30px 20px" }}>
        <Select
          placeholder="Seleccione un almacén"
          style={{ width: 300 }}
          name="almacen"
          onChange={(value) => setAlmacen_id(value)}
          options={data.map((item, i) => {
            return {
              value: item.id,
              label: item.nombre,
            };
          })}
        />
      </div>
      {almacen_id !== "" && almacen_id !== "-1" ? (
        <div style={{ padding: "0px 20px 20px 20px" }}>
          <Buscador
            abrirModal={setModal}
            abrirEntrada={setModal1}
            abrirSalida={setModal1}
            abrirRequerimiento={setModal3}
          />
          <br />
          {result?.length > 0 ? (
            <Tabla columns={columns} table={result} filas={10} />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span>No hay registros para mostrar.</span>}
            />
          )}
        </div>
      ) : (
        ""
      )}
      <ModalRegistrarProducto
        open={modal}
        actualizarTabla={getProductoAlmacen}
        id={almacen_id}
        data={data1}
      />
      <ModalHistorialEntradas open={modal1} id={almacen_id} data={data1} />
      <ModalRequerimiento id={almacen_id} data={data1} />
    </>
  );
};

export default InventarioLayout;
