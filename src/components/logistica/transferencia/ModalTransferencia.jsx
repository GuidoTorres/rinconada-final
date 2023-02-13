import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { CrudContext } from "../../../context/CrudContext";
import { transferenciaLayout } from "../../../data/dataTable";
import Tabla from "../../tabla/Tabla";
import { notificacion } from "../../../helpers/mensajes";
import MainModal from "../../modal/MainModal";
import { Button, DatePicker, Form, Input, Select } from "antd";
import "../styles/modalTransferencia.css";

const ModalTransferencia = ({ almacen_id, actualizarTabla }) => {
  const [form] = Form.useForm();

  const { getData, createData, dataToEdit, setModal, modal, cargando, setCargando } =
    useContext(CrudContext);

  const initialValues = {
    almacen_id: almacen_id,
    origen: almacen_id,
    fecha: "",
    producto: "",
    destino: "",
    cantidad: "",
    estado_origen: "",
    estado_destino: "",
  };

  const [almacen, setAlmacen] = useState([]);
  const [producto, setProducto] = useState([]);
  const [productoFinal, setProductoFinal] = useState([]);

  const [almacenDestino, setAlmacenDestino] = useState([]);
  const [transferencia, setTransferencia] = useState(initialValues);
  const [tabla, setTabla] = useState([]);
  const [newJson, setNewJson] = useState([]);
  const [idCantidad, setIdCantidad] = useState("");

  const fetchData = async () => {
    const response = await getData("almacen");
    const response1 = await getData("producto");

    setAlmacen(response.data);
    setProducto(response1.data);
  };

  const closeModal = () => {
    setModal(false);
  };

  useEffect(() => {
    const filterProductoOrigen = producto.filter(
      (item) => transferencia.origen == item.almacen_id
    );
    const filterAlmacen = almacen.filter(
      (item) => parseInt(transferencia.origen) !== item.id
    );
    setProductoFinal(filterProductoOrigen);
    setAlmacenDestino(filterAlmacen);
  }, [transferencia]);

  const handleChange = (e, text, i) => {
    if (!text && e.target) {
      const { name, value } = e.target;
      form.setFieldsValue({
        [name]: value,
      });
      setTransferencia((values) => {
        return { ...values, [name]: value };
      });
    } else {
      form.setFieldsValue({
        [text]: e,
      });
      setTransferencia((values) => {
        return { ...values, [text]: e };
      });
    }
    if (i !== undefined) {
      setIdCantidad(i);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let formatData;
    let filterIfRepeated;
    if (transferencia.producto !== "") {
      let filterProducto = producto.filter(
        (item) => item.id == transferencia.producto
      );

      //Dar formato a la data para el post
      formatData = filterProducto.map((item) => {
        let temp = filterProducto.find(
          (ele) => ele.id === transferencia.producto
        );
        return {
          almacen_origen: transferencia.origen,
          almacen_destino: transferencia.destino,
          producto_id: item.id,
          codigo_interno: item.codigo_interno,
          fecha: transferencia.fecha,
          codigo: item.codigo,
          nombre: item.nombre,
          stock: item.stock,
          id: item.id,
          stock_origen: parseInt(item.stock),
          cantidad: transferencia.cantidad,
        };
      });

      filterIfRepeated = formatData.filter(
        (item) => !tabla.some((item2) => item.id == item2.id)
      );
    }

    if (
      filterIfRepeated?.length !== 0 &&
      transferencia.destino &&
      transferencia.origen &&
      transferencia.fecha
    ) {
      //filtrar si el producto esta en el almacen de destino
      let filterDestino = producto.filter(
        (item) => item.almacen_id == transferencia.destino
      );

      // filtrar si tienen el mismo codigo interno
      let filterProductoDestino = filterDestino?.filter((item) =>
        formatData.some((item2) => item.codigo_interno === item2.codigo_interno)
      );

      let newArray = formatData?.map((item) => {
        return {
          almacen_origen: item.almacen_origen,
          almacen_destino: item.almacen_destino,
          producto_origen: item.producto_id,
          codigo_interno: item.codigo_interno,
          fecha: item.fecha,
          codigo: item.codigo,
          nombre: item.nombre,
          stock: item.stock,
          id: item.id,
          stock_origen: parseInt(item.stock),
          producto_destino: parseInt(
            filterProductoDestino.map((item2) => item2.id)
          ),
          stock_destino: parseInt(
            filterProductoDestino.map((item2) => item2.stock)
          ),
          cantidad: item.cantidad,
        };
      });

      if (filterProductoDestino.length !== 0) {
        setTabla((current) => [...current, newArray[0]]);
      } else {
        notificacion(500, "Producto no registrado en almacén de destino.");
      }
    }
    if (idCantidad !== "") {
      tabla[idCantidad].cantidad = transferencia.cantidad;
    }
  }, [transferencia]);

  const handleSubmit = async (e) => {
    let route = "almacen/transferencia";
    e.preventDefault();
    setCargando(true)
    const response = await createData(tabla, route);
    if (response) {
      notificacion(response.status, response.msg);
      actualizarTabla();
      closeModal();
      setCargando(false)
    }
  };

  const handleDelete = (e) => {
    setTabla((current) => current.filter((item) => item.id !== e.id));
    tabla[idCantidad].cantidad = "";
  };

  const columns = transferenciaLayout(
    handleChange,
    handleDelete,
    transferencia.cantidad
  );
  return (
    <MainModal
      className={"modal-transferencia"}
      title={"Realizar transferencia"}
      open={modal}
      width={800}
      closeModal={closeModal}
    >
      <Form
        form={form}
        className="modal-body"
        onFinish={handleSubmit}
        layout="horizontal"
      >
        <Form.Item name="fecha">
          <DatePicker
            defaultValue={transferencia.fecha}
            style={{
              width: "100%",
            }}
            format={"YYYY-MM-DD"}
            name="fecha"
            placeholder="Fecha"
            onChange={(e) => handleChange(e, "fecha")}
          />
        </Form.Item>

        <Form.Item name="producto">
          <Select
            showSearch
            placeholder="Seleccione un producto"
            name="producto"
            value={transferencia.producto}
            optionFilterProp="children"
            onChange={(e) => handleChange(e, "producto")}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={productoFinal.map((item) => {
              return {
                label: item.nombre,
                value: item.id,
              };
            })}
          />
        </Form.Item>

        <Form.Item
          name="destino"
          rules={[
            {
              required: true,
              message: "Campo obligatorio!",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Almacén destino"
            name="destino"
            value={transferencia.destino}
            optionFilterProp="children"
            onChange={(e) => handleChange(e, "destino")}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={almacenDestino.map((item) => {
              return {
                label: item.nombre,
                value: item.id,
              };
            })}
          />
        </Form.Item>
      </Form>

      <div className="tabla-container">
        {tabla.length !== 0 ? (
          <Tabla columns={columns} table={tabla} />
        ) : (
          <Tabla columns={columns} table={newJson} />
        )}
      </div>

      {tabla.length !== 0 ? (
        <div className="button-transferir">
          <Button type="primary" onClick={handleSubmit}>
            Transferir
          </Button>
        </div>
      ) : (
        ""
      )}
    </MainModal>
  );
};

export default ModalTransferencia;
