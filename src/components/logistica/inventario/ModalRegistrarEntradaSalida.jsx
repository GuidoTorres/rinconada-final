import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { CrudContext } from "../../../context/CrudContext";
import { registrarEntrada } from "../../../data/dataTable";
import { entradaSalidaValues } from "../../../data/initalValues";
import Tabla from "../../tabla/Tabla";
import { Select, Modal, Button, Input } from "antd";
import { notificacion } from "../../../helpers/mensajes";
import ModalRegistrarProducto from "./ModalRegistrarProducto";
import "../styles/modalRegistrarEntrada.css";

const ModalRegistrarEntradaSalida = ({
  almacen_id,
  actualizarTabla,
  productos,
}) => {
  const {
    dataToEdit,
    setModal2,
    tipo,
    setDataToEdit,
    createData,
    updateData,
    modal,
    setModal,
    getData,
    getDataById,
    modal2,
    cargando,
    setCargando,
  } = useContext(CrudContext);

  const initialValues = entradaSalidaValues(tipo, almacen_id);
  const [entrada, setEntrada] = useState(initialValues);
  const [newJson, setNewJson] = useState([]);
  const [area, setArea] = useState([]);
  const [entradaId, setEntradaId] = useState([]);
  const [idCantidad, setIdCantidad] = useState("");
  const [trabajador, setTrabajador] = useState([]);
  const [pedido, setPedido] = useState([]);
  const [pedidoEntrada, setPedidoEntrada] = useState([]);
  const [areaId, setAreaId] = useState();
  const [productoAlmacen, setProductoAlmacen] = useState([]);
  const [buscador, setBuscador] = useState("");

  const getArea = async () => {
    const route = "area";
    const route1 = `entrada`;
    const route2 = "trabajador";
    const route3 = "pedido/id";
    const route4 = "pedido/entrada";

    const response = getData(route);
    const response1 = getData(route1);
    const response2 = getData(route2);
    const response3 = getData(route3);
    const response4 = getData(route4);
    const response5 = getDataById("almacen/producto", almacen_id);

    const all = await Promise.all([
      response,
      response1,
      response2,
      response3,
      response4,
      response5,
    ]);

    setArea(all[0].data);
    setEntradaId(all[1].data);
    setTrabajador(all[2].data);
    setPedido(all[3].data);
    setPedidoEntrada(all[4].data);
    setProductoAlmacen(all[5].data);
  };

  const closeModal = () => {
    setModal2(false);
    setDataToEdit(null);
    setEntrada(initialValues);
    setNewJson([]);
  };

  useEffect(() => {
    getArea();
  }, []);

  // para juntar productos iguales de requerimientos en uno solo
  useEffect(() => {
    if (entrada.codigo_pedido !== "" && dataToEdit === null) {
      const filterData = pedidoEntrada.filter(
        (item) =>
          item.id === entrada.codigo_pedido &&
          item.requerimiento_pedidos
            .map((item) => item.requerimiento)
            .filter((item) => item.almacen_id === almacen_id)
      );

      const formatData =
        filterData.length > 0 &&
        filterData
          .map((item) =>
            item?.requerimiento_pedidos?.map((data) => data?.requerimiento_id)
          )
          .toString();

      const formatProducto =
        filterData.length > 0 &&
        filterData
          .map((item) => item?.requerimiento_pedidos)
          .flat()
          .map((item) => item?.requerimiento?.requerimiento_productos)
          .flat()
          .map((item) => {
            return {
              cantidad: parseInt(item?.cantidad),
              almacen_id: item?.producto?.almacen_id,
              categoria: item?.producto?.categoria,
              id: item?.producto_id,
              codigo_barras: item?.producto?.codigo_barras,
              codigo_interno: item?.producto?.codigo_interno,
              descripcion: item?.producto?.descripcion,
              fecha: item?.producto?.fecha,
              producto_id: item?.producto_id,
              nombre: item?.producto?.nombre,
              precio: item?.producto?.precio,
              stock: item?.producto?.stock,
              unidad: item?.producto?.unidad,
            };
          });

      const mergeProducto =
        formatProducto.length > 0 &&
        formatProducto.reduce((value, current) => {
          let temp = value.find((o) => o.producto_id == current.producto_id);
          if (!temp) {
            value.push(current);
          } else {
            temp.cantidad += current.cantidad;
            Object.assign(temp);
          }
          return value;
        }, []);

      const formatMerge =
        mergeProducto.length > 0 &&
        mergeProducto.map((item) => {
          return {
            cantidad: item?.cantidad,
            almacen_id: item?.almacen_id,
            categoria: item?.categoria,
            id: item?.id,
            codigo_barras: item?.codigo_barras,
            codigo_interno: item?.codigo_interno,
            descripcion: item?.descripcion,
            fecha: item?.fecha,
            producto_id: item?.producto_id,
            nombre: item?.nombre,
            precio: item?.precio,
            stock: item?.stock,
            unidad: item?.unidad,
            costo:
              parseInt(item?.cantidad) * parseFloat(item?.precio).toFixed(2),
            tipo: entrada?.tipo,
            codigo: entrada?.codigo,
            motivo: entrada?.motivo,
            encargado: entrada?.encargado,
            codigo_compra: entrada?.codigo_compra,
            boleta: entrada?.boleta,
            codigo_requerimiento: entrada?.codigo_requerimiento,
            area: areaId,
            dni: item.dni,
          };
        });

      setNewJson(formatMerge);
      entrada.codigo_requerimiento = formatData;
    }
  }, [entrada]);

  //para calcular el costo total de de los productos
  useEffect(() => {
    let costo = newJson.reduce(
      (acc, value) => parseFloat(acc) + parseFloat(value.costo),
      0
    );
    setEntrada((value) => ({ ...value, costo_total: costo }));
  }, [newJson]);

  // si es edicion llenar el formulario con data del servidor, sino valores iniciales
  useEffect(() => {
    if (dataToEdit !== null) {
      setEntrada(dataToEdit);

      const formatData = dataToEdit?.producto_entrada_salidas?.map((item) => {
        return {
          motivo: dataToEdit.motivo,
          fecha: dataToEdit.fecha,
          encargado: dataToEdit.encargado,
          codigo_compra: dataToEdit.codigo_compra,
          codigo_requerimiento: dataToEdit.codigo_requerimiento,
          boleta: dataToEdit.boleta,
          cantidad: parseInt(item.cantidad),
          costo: item.costo,
          nombre: item.producto.nombre,
          unidad: item.producto.unidad_id,
          id: item.producto.id,
          codigo_producto: item.producto.id,
          codigo: item.producto.codigo,
          producto_id: item.producto.id,
          tipo: dataToEdit.tipo,
          stock: item.stock
        };
      });

      setNewJson(formatData);
    }
  }, []);

  // para obtener al trabajador en base al dni
  useEffect(() => {
    if (entrada?.dni?.length >= 7) {
      const filterDni = trabajador?.filter((item) => item.dni === entrada.dni);

      if (filterDni.length > 0) {
        const traba = filterDni?.at(-1);
        setEntrada((values) => ({
          ...values,
          encargado:
            traba?.nombre +
            " " +
            traba?.apellido_paterno +
            " " +
            traba?.apellido_materno,
        }));
        setAreaId(traba?.area);
      }
    }
  }, [entrada.dni]);

  // agregar productos a la tabla si se usa el buscador
  useEffect(() => {
    if (productoAlmacen.length > 0 && entrada.producto) {
      const filterProducto = productoAlmacen?.filter(
        (item) => item.id === entrada.producto
      );

      console.log(filterProducto);

      //dar formato para entrada o salida
      const formatData =
        tipo === "entrada" && filterProducto?.length > 0
          ? filterProducto.map((item) => {
              return {
                id: item.id,
                codigo_producto: item.id,
                nombre: item.nombre,
                cantidad: entrada.cantidad,
                unidad: item.unidad,
                boleta: entrada.boleta,
                motivo: entrada.motivo,
                categoria: entrada.categoria,
                codigo: parseInt(entradaId[entradaId.length - 1]?.id) + 1,
                codigo_compra: entrada.codigo_compra,
                codigo_requerimiento: entrada.codigo_requerimiento,
                encargado: entrada.encargado,
                fecha: entrada.fecha,
                producto_id: item.id,
                tipo: entrada.tipo,
                almacen_id: almacen_id,
                producto: entrada.producto,
                stock: parseInt(item.stock),
                nuevo_stock: parseInt(item.stock) + parseInt(entrada.cantidad),
                costo_inicial: parseFloat(item?.precio),
                costo: parseFloat(item.precio).toFixed(2),
              };
            })
          : tipo === "salida" && filterProducto?.length > 0
          ? filterProducto?.map((item) => {
              return {
                id: item?.id,
                codigo_producto: item?.id,
                nombre: item?.nombre,
                cantidad: entrada?.cantidad,
                unidad: item?.unidad,
                boleta: entrada?.boleta,
                motivo: entrada?.motivo,
                categoria: entrada?.categoria,
                codigo: parseInt(entradaId[entradaId?.length - 1]?.id) + 1,
                codigo_compra: entrada?.codigo_compra,
                codigo_requerimiento: entrada?.codigo_requerimiento,
                encargado: entrada?.encargado,
                fecha: entrada?.fecha,
                producto_id: item?.id,
                tipo: entrada?.tipo,
                almacen_id: almacen_id,
                area: entrada?.area || areaId,
                stock: parseInt(item?.stock),
                costo_inicial: parseFloat(item?.precio),
                costo: parseFloat(item?.precio).toFixed(2),
              };
            })
          : "";

      if (formatData.length > 0) {
        const result = newJson?.filter((item) => {
          const prueba = formatData.find(
            (ele) => ele.codigo_producto === item.codigo_producto
          );

          if (prueba) {
            return item;
          } else {
            return prueba;
          }
        });

        if (result.length === 0) {
          setNewJson((value) => [...value, formatData.at(-1)]);
        }
      }
    }
  }, [entrada]);

  //para actualizar la cantidad y el costo en la tabla
  useEffect(() => {
    if (idCantidad !== "" && newJson.length !== 0 && idCantidad !== undefined) {
      setNewJson((state) =>
        state.map((item, i) =>
          i === idCantidad
            ? {
                ...item,
                cantidad: entrada.cantidad,
                costo:
                  entrada.cantidad !== ""
                    ? parseFloat(item.costo_inicial) *
                      parseFloat(entrada.cantidad)
                    : item.costo_inicial,
              }
            : item
        )
      );
    }
  }, [idCantidad, entrada.cantidad]);

  const handleSubmit = async (e) => {
    let route = "entrada";
    e.preventDefault();
    if (dataToEdit === null) {
      setCargando(true);
      const response = await createData(newJson, route);
      if (response) {
        notificacion(response.status, response.msg);
        closeModal();
        actualizarTabla();
        setCargando(false);
      }
    } else {
      setCargando(true);
      const response = await updateData(newJson, dataToEdit.id, route);
      if (response) {
        notificacion(response.status, response.msg);
        closeModal();
        actualizarTabla();
        setCargando(false);
      }
    }
  };

  const handleData = (e, i, text) => {
    if (e.target) {
      const { name, value } = e.target;

      setEntrada((values) => {
        return { ...values, [name]: value };
      });

      if (i !== undefined) {
        setIdCantidad(i);
      }
    }
    if (text) {
      setEntrada((values) => {
        return { ...values, [text]: e };
      });
    }
  };

  const handleDelete = (e) => {
    setNewJson((current) => current.filter((item) => item.id !== e.id));
    setEntrada(initialValues);
  };

  const columns = registrarEntrada(
    handleData,
    handleDelete,
    entrada.cantidad,
    dataToEdit,
    entrada?.codigo_pedido,
    newJson?.cantidad
  );

  return (
    <>
      <Modal
        destroyOnClose={true}
        className="modal-registrar-entrada"
        title={dataToEdit ? `Registrar ${tipo}` : `Registrar ${tipo}`}
        open={modal2}
        centered
        onCancel={closeModal}
        footer={null}
        width={950}
      >
        <form className="modal-body">
          <div className="container">
            <label>Código</label>
            <Input
              value={parseInt(entradaId.at(-1)?.id) + 1 || 1}
              type="text"
              name="codigo"
              disabled
              onChange={handleData}
            />
          </div>
          <div className="container">
            <label>Motivo de {tipo}</label>

            <Input
              placeholder={`Motivo de ${tipo}`}
              value={entrada.motivo}
              type="text"
              name="motivo"
              onChange={handleData}
            />
          </div>
          <div className="container">
            <label>Fecha de {tipo}</label>
            <Input
              type="date"
              placeholder="Fecha "
              className="fecha"
              name="fecha"
              defaultValue={entrada.fecha}
              onChange={handleData}
            />
          </div>

          <div className="container">
            <label>Dni</label>
            <Input
              placeholder="Dni"
              type="number"
              name="dni"
              value={entrada.dni}
              onChange={handleData}
            />
          </div>
          <div className="container">
            {tipo === "entrada" ? (
              <>
                <label>Encargado</label>
                <Input
                  placeholder="Encargado"
                  type="text"
                  name="encargado"
                  value={entrada.encargado}
                  onChange={handleData}
                />
              </>
            ) : (
              <>
                <label>Personal</label>
                <Input
                  placeholder="Personal"
                  type="text"
                  name="personal"
                  value={entrada.encargado}
                  onChange={handleData}
                />
              </>
            )}
          </div>
          <div className="container">
            {tipo === "entrada" ? (
              <>
                <label>Código orden de compra</label>
                <Input
                  placeholder="Código orden de compra"
                  type="text"
                  name="codigo_compra"
                  value={entrada.codigo_compra}
                  onChange={handleData}
                />
              </>
            ) : (
              <>
                <label>Área</label>
                <Select
                  placeholder="Área"
                  name="area"
                  value={entrada.area || areaId}
                  onChange={(e) => handleData(e, null, "area")}
                  options={area.map((item, i) => {
                    return {
                      label: item.nombre,
                      value: item.id,
                    };
                  })}
                />
              </>
            )}
          </div>
          {tipo === "entrada" ? (
            <div>
              <label>Boleta/Factura</label>
              <Input
                placeholder="Boleta/Factura"
                type="text"
                name="boleta"
                value={entrada.boleta}
                onChange={handleData}
              />
            </div>
          ) : (
            <div style={{ display: "none", width: "0", height: "0" }}></div>
          )}
          {tipo === "entrada" ? (
            <div className="container">
              <label>Código de pedido</label>
              <Select
                placeholder="Codigo de pedido"
                name="codigo_pedido"
                value={entrada.codigo_pedido}
                onChange={(e) => handleData(e, null, "codigo_pedido")}
                options={pedido.map((item, i) => {
                  return {
                    label: item.id,
                    value: item.id,
                  };
                })}
              />
            </div>
          ) : (
            <div style={{ display: "none", width: "0", height: "0" }}></div>
          )}
          <div className="container">
            <label>Código de requerimiento</label>
            <Input
              placeholder="Código de requerimiento"
              type="text"
              name="codigo_requerimiento"
              value={entrada.codigo_requerimiento}
              onChange={handleData}
            />
          </div>
          <div className="container">
            <label>Productos</label>

            <Select
              placeholder="Ingrese un producto"
              showSearch
              optionFilterProp="children"
              name="producto"
              // value={buscador}
              onSearch={(e) => setBuscador(e)}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={(e) => handleData(e, null, "producto")}
              options={productos.map((item, i) => {
                return {
                  value: item.id,
                  label: item.nombre,
                };
              })}
            />
          </div>

          <div className="productos">
            {tipo === "entrada" ? (
              <div className="agregar">
                <Button onClick={() => setModal(true)}>+</Button>
              </div>
            ) : (
              ""
            )}
          </div>
        </form>
        <div className="tabla">
          <Tabla columns={columns} table={newJson} />
        </div>

        {newJson.length > 0 ? (
          <label htmlFor="">
            <strong>Costo total:</strong> {entrada.costo_total}
          </label>
        ) : (
          ""
        )}
        <div className="button-container">
          {newJson && newJson?.length !== 0 ? (
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={cargando ? true : false}
            >
              Guardar
            </Button>
          ) : (
            ""
          )}
        </div>
      </Modal>

      {modal && <ModalRegistrarProducto id={almacen_id} />}
    </>
  );
};

export default ModalRegistrarEntradaSalida;
