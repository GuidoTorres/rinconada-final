import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { CrudContext } from "../../../context/CrudContext";
import {
  mostrarRequerimientoTable,
  requerimientoTable,
} from "../../../data/dataTable";
import { requerimientoValues } from "../../../data/initalValues";
import Tabla from "../../tabla/Tabla";
import { Select, Modal, Input, DatePicker, Button, Empty } from "antd";
import { notificacion } from "../../../helpers/mensajes";
import "../styles/modalRequerimientos.css";

const ModalRequerimiento = ({ id, data, actualizarTabla }) => {
  const {
    dataToEdit,
    setModal3,
    createData,
    updateData,
    setDataToEdit,
    getData,
    modal3,
  } = useContext(CrudContext);

  const [codRequerimiento, setCodRequerimiento] = useState("");
  const initialValues = requerimientoValues(id);
  const [requerimiento, setRequerimiento] = useState(initialValues);
  const [text, setText] = useState("");
  const [search, setSearch] = useState([]);
  const [newJson, setNewJson] = useState([]);
  const [key, setKey] = useState("");
  const [agregar, setAgregar] = useState("");
  const [area, setArea] = useState([]);
  const [idRequerimiento, setIdRequerimiento] = useState("");
  const [trabajador, setTrabajador] = useState([]);
  const [dni, setDni] = useState();
  const [areaId, setAreaId] = useState();

  const closeModal = () => {
    setModal3(false);
    setDataToEdit(null);
    setSearch([]);
    setNewJson([]);
    setRequerimiento(initialValues);
  };

  const getRequerimientoCodigo = async () => {
    const route = "requerimiento";
    const route1 = "area";
    const route2 = "trabajador";

    const response = await getData(route);
    const response1 = await getData(route1);
    const response2 = await getData(route2);

    const all = await Promise.all([response, response1, response2]);

    setCodRequerimiento(all[0].data);
    setArea(all[1].data);
    setTrabajador(all[2].data);
  };

  useEffect(() => {
    getRequerimientoCodigo();
  }, []);

  console.log("====================================");
  console.log(requerimiento);
  console.log("====================================");

  useEffect(() => {
    if (dataToEdit !== null) {
      setRequerimiento(dataToEdit);
    } else {
      setRequerimiento(initialValues);
    }
  }, [dataToEdit]);

  useEffect(() => {
    // para obtener al trabajador en base al dni

    if (requerimiento?.dni?.length >= 7) {
      const filterDni = trabajador?.filter(
        (item) => item.dni === requerimiento.dni
      );

      if (filterDni.length > 0) {
        const traba = filterDni?.at(-1);
        setRequerimiento((values) => ({
          ...values,
          solicitante:
            traba?.nombre +
            " " +
            traba?.apellido_paterno +
            " " +
            traba?.apellido_materno,
          area: traba?.contrato
            ?.filter((item) => item?.finalizado === false)
            ?.at(-1)?.area,
        }));
      }
    }
  }, [requerimiento.dni]);

  useEffect(() => {
    if (requerimiento.producto && data) {
      const filterProducto = data?.filter(
        (item) => item.id === requerimiento.producto
      );
      const formatData =
        filterProducto.length > 0 &&
        filterProducto.map((item) => {
          return {
            codigo_producto: item.id,
            codigo: requerimiento.codigo || "",
            fecha_pedido: requerimiento.fecha_pedido || "",
            fecha_entrega: requerimiento.fecha_entrega || "",
            solicitante: requerimiento.solicitante || "",
            area: requerimiento.area || "",
            celular: requerimiento.celular || "",
            proyecto: requerimiento.proyecto || "",
            producto_id: item.id,
            descripcion: item.nombre,
            cantidad: requerimiento.cantidad || "",
            unidad: item.unidad,
            almacen_id: id,
            stock: item.stock,
          };
        });

      if (formatData.length !== 0) {
        setSearch([formatData[0]]);
        if (agregar !== "") {
          let newState = [requerimiento];

          newState[0].producto = "";
          newState[0].categoria = "";
          newState[0].cantidad = "";
          setNewJson((current) => [...current, search[0]]);
          setSearch([]);
        }
      }
    }

    if (idRequerimiento !== "" && idRequerimiento !== undefined) {
      setNewJson((state) =>
        state.map((item, i) =>
          i === idRequerimiento
            ? { ...item, cantidad: requerimiento.cantidad }
            : item
        )
      );
    }
  }, [text, requerimiento, key, agregar]);

  useEffect(() => {
    if (newJson?.length !== 0) {
      setKey("");
      setAgregar("");
    }
  }, [newJson]);

  const handleData = (e, i, text) => {
    if (i !== undefined) {
      setIdRequerimiento(i);
    }

    if (!text && e.target) {
      const { name, value } = e.target;

      setRequerimiento((values) => {
        return { ...values, [name]: value };
      });
    } else {
      setRequerimiento((values) => {
        return { ...values, [text]: e };
      });
    }
  };

  const handleSubmit = async (e) => {
    let route = "requerimiento";
    let routeUpdate = "requerimiento/producto";
    e.preventDefault();

    if (dataToEdit === null) {
      const response = await createData(newJson, route);
      if (response.status === 200) {
        notificacion(response.status, response.msg);
        closeModal();
      }
    } else {
      const response = await updateData(
        requerimiento,
        dataToEdit.id,
        routeUpdate
      );
      if (response.status === 200) {
        notificacion(response.status, response.msg);
        actualizarTabla();
        closeModal();
      }
    }
  };

  useEffect(() => {
    if (dataToEdit !== null) {
      const filterData = dataToEdit.requerimiento_productos?.map((item) => {
        return {
          id: dataToEdit.id,
          cantidad: item.cantidad,
          codigo_producto: item.producto.id,
          codigo_barras: item.producto.codigo_barras,
          codigo_interno: item.producto.codigo_interno,
          descripcion: item.producto.nombre,
          fecha: item.producto.fecha,
          unidad: item.producto.unidad,
        };
      });
      setNewJson(filterData);
    }
  }, [dataToEdit]);

  const handleDelete = (e) => {
    setNewJson((current) =>
      current.filter((item) => item.producto_id !== e.producto_id)
    );
  };

  const column1 = mostrarRequerimientoTable(handleDelete);

  const columns = requerimientoTable(
    handleData,
    handleDelete,
    requerimiento,
    dataToEdit
  );

  return (
    <Modal
      destroyOnClose={true}
      className="modal-requerimiento"
      title={dataToEdit === null ? "Registrar requerimiento" : "Editar requerimiento"}
      open={modal3}
      centered
      onCancel={closeModal}
      footer={null}
      width={800}
    >
      <form className="modal-body">
        <div className="container">
          <label>Código requerimiento</label>
          <Input
            disabled
            value={requerimiento.codigo}
            type="text"
            name="codigo"
            onChange={handleData}
          />
        </div>
        <div className="container">
          <label>Fecha de Requerimiento</label>
          <Input
            type="date"
            placeholder="Fecha de pedido"
            name="fecha_pedido"
            onChange={handleData}
            value={requerimiento.fecha_pedido}
          />
        </div>
        <div className="container">
          <label>Fecha de entrega</label>
          <Input
            type="date"
            placeholder="Fecha de entrega"
            name="fecha_entrega"
            value={requerimiento.fecha_entrega}
            onChange={handleData}
          />
        </div>
        <div className="container">
          <label>Dni</label>
          <Input
            type="number"
            name="dni"
            placeholder="Dni"
            value={requerimiento.dni}
            onChange={handleData}
          />
        </div>
        <div className="container">
          <label>Nombre solicitante</label>
          <Input
            value={requerimiento.solicitante}
            type="text"
            name="solicitante"
            placeholder="Solicitante"
            onChange={handleData}
          />
        </div>
        <div className="container">
          <label>Área</label>
          <Select
            placeholder="Área"
            name="area"
            value={requerimiento.area}
            onChange={(e) => handleData(e, null, "area")}
            options={area.map((item, i) => {
              return {
                value: item.nombre,
                label: item.nombre,
              };
            })}
          />
        </div>
        <div className="container">
          <label>Celular</label>
          <Input
            value={requerimiento.celular}
            placeholder="Celular"
            type="text"
            name="celular"
            onChange={handleData}
          />
        </div>
        <div className="container">
          <label>Proyecto/Actividad</label>
          <Input
            value={requerimiento.proyecto}
            placeholder="Proyecto"
            type="text"
            name="proyecto"
            onChange={handleData}
          />
        </div>
        <div className="container">
          <label>Código de requerimiento</label>
          <Select
            placeholder="Codigo requerimiento"
            name="codigo_requerimiento"
            value={requerimiento.codigo_requerimiento}
            onChange={handleData}
            options={
              codRequerimiento.length > 0 &&
              codRequerimiento
                ?.filter((item) => item.almacen_id === id)
                .map((item, i) => {
                  return {
                    value: item.id,
                    label: item.nombre,
                  };
                })
            }
          />
        </div>
        <div className="container">
          <label>Productos</label>

          <Select
            showSearch
            optionFilterProp="children"
            name="producto"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={(e) => handleData(e, null, "producto")}
            options={data?.map((item, i) => {
              return {
                value: item.id,
                label: item.nombre,
              };
            })}
          />
        </div>

        {search?.length > 0 && (
          <div className="agregar">
            <Button onClick={() => setAgregar("agregar")}>
              <AiOutlineCheck />
            </Button>
          </div>
        )}
      </form>
      <br />
      {search && search?.length !== 0 ? (
        <Tabla columns={column1} table={search} />
      ) : (
        <Tabla columns={columns} table={newJson} />
      )}
      <div className="button-container">
        {newJson?.length !== 0 ? (
          <Button type="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        ) : (
          ""
        )}
      </div>
    </Modal>
  );
};

export default ModalRequerimiento;
