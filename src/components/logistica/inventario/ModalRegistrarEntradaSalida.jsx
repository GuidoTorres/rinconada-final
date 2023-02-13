import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai";
import { CrudContext } from "../../../context/CrudContext";
import {
  mostrarProductoEntrada,
  registrarEntrada,
} from "../../../data/dataTable";
import { entradaSalidaValues } from "../../../data/initalValues";
import Tabla from "../../tabla/Tabla";
import { Select, Modal, Button, Input, DatePicker, Empty } from "antd";
import "../styles/modalRegistrarEntrada.css";
import { notificacion } from "../../../helpers/mensajes";
import ModalRegistrarProducto from "./ModalRegistrarProducto";

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

  const [text, setText] = useState("");
  const [search, setSearch] = useState([]);
  const initialValues = entradaSalidaValues(tipo, almacen_id);
  const [entrada, setEntrada] = useState(initialValues);
  const [newJson, setNewJson] = useState([]);
  const [key, setKey] = useState("");
  const [agregar, setAgregar] = useState("");
  const [area, setArea] = useState([]);
  const [entradaId, setEntradaId] = useState([]);
  const [idCantidad, setIdCantidad] = useState("");
  const [trabajador, setTrabajador] = useState([]);
  const [dni, setDni] = useState();
  const [pedido, setPedido] = useState([]);
  const [pedidoEntrada, setPedidoEntrada] = useState([]);
  const [costoTotal, setCostoTotal] = useState("");
  const [requerimientoJson, setRequerimientoJson] = useState([]);
  const [areaId, setAreaId] = useState();
  const [productoAlmacen, setProductoAlmacen] = useState([]);
  const [buscador, setBuscador] = useState("");

  const getArea = async () => {
    const route = "area";
    const route1 = `entrada`;
    const route2 = "trabajador";
    const route3 = "pedido/id";
    const route4 = "pedido/entrada";

    const response = await getData(route);
    const response1 = await getData(route1);
    const response2 = await getData(route2);
    const response3 = await getData(route3);
    const response4 = await getData(route4);
    const response5 = await getDataById("almacen/producto", almacen_id);
    setArea(response.data);
    setEntradaId(response1.data);
    setTrabajador(response2.data);
    setPedido(response3.data);
    setPedidoEntrada(response4.data);
    setProductoAlmacen(response5.data);
  };

  const closeModal = () => {
    setModal2(false);
    setDataToEdit(null);
    setEntrada(initialValues);
    setSearch([]);
    setNewJson([]);
    setCostoTotal("");
  };

  useEffect(() => {
    getArea();
  }, []);

  useEffect(() => {
    // para juntar productos iguales de requerimientos en uno solo
    if (entrada.codigo_pedido !== "" && dataToEdit === null) {
      const filterData = pedidoEntrada.filter(
        (item) =>
          item.id == entrada.codigo_pedido &&
          item.requerimiento_pedidos
            .map((item) => item.requerimiento)
            .filter((item) => item.almacen_id == almacen_id)
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
            encargado: entrada?.encargado || dni,
            codigo_compra: entrada?.codigo_compra,
            boleta: entrada?.boleta,
            codigo_requerimiento: entrada?.codigo_requerimiento,
            area: areaId,
          };
        });

      if (formatMerge.length > 0) {
        let costo = formatMerge.reduce((acc, value) => acc + value.costo, 0);
        setCostoTotal(costo);
      }

      setNewJson(formatMerge);
      entrada.codigo_requerimiento = formatData;
    }
  }, [entrada]);

  useEffect(() => {
    // si es edicion llenar el formulario con data del servidor, sino valores iniciales
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
        };
      });

      setNewJson(formatData);
    } else {
      setEntrada(initialValues);
    }
  }, [dataToEdit]);

  useEffect(() => {
    // para obtener al trabajador en base al dni
    if (entrada?.dni?.length > 7) {
      const filterDni = trabajador.filter((item) => item.dni == entrada.dni);

      const prueba = [...filterDni].pop();
      const filter = prueba.contrato.map((item) => {
        return {
          nombre:
            prueba?.nombre +
            " " +
            prueba?.apellido_paterno +
            " " +
            prueba?.apellido_materno,
          area: parseInt(
            area.filter((data) => data.id == item.area).map((item) => item.id)
          ),
        };
      });
      const obj = [...filter].pop();
      setEntrada((values) => ({ ...values, encargado: obj.nombre }));
      setAreaId(obj.area);
    } else {
      setDni("");
    }
  }, [entrada.dni]);

  useEffect(() => {
    // agregar productos a la tabla si se usa el buscador
    if (productoAlmacen.length > 0 && entrada.producto) {
      const filterProducto = productoAlmacen?.filter(
        (item) => item.id === entrada.producto
      );

      //dar formato para entrada o salida
      const formatData =
        tipo === "entrada" && filterProducto.length > 0
          ? filterProducto.map((item) => {
              return {
                id: item.id,
                codigo_producto: item.codigo,
                nombre: item.nombre,
                cantidad: entrada.cantidad || item.stock,
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
                costo: parseFloat(item.precio).toFixed(2),
              };
            })
          : tipo === "salida" && filterProducto.length > 0
          ? filterProducto.map((item) => {
              return {
                id: item.id,
                codigo_producto: item.codigo,
                nombre: item.nombre,
                cantidad: entrada.cantidad || item.stock,
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
                area: entrada.area || areaId,
                stock: parseInt(item.stock),
                costo: parseFloat(item.precio).toFixed(2),
              };
            })
          : "";

      if (formatData.length > 0) {
        setSearch([formatData[0]]);

        if (agregar !== "") {
          let newState = [entrada];

          newState[0].producto = "";
          newState[0].categoria = "";
          newState[0].cantidad = "";

          setNewJson((current) => [...current, formatData[0]]);
          setSearch([]);
        }
      }
    }

    //para actaulizar la cantidad cada vez que se cambia en la tabla
    if (idCantidad !== "" && newJson.length !== 0 && idCantidad !== undefined) {
      newJson[idCantidad].cantidad = entrada.cantidad;

      if (entrada.cantidad !== "") {
        newJson[idCantidad].costo =
          parseFloat(newJson[idCantidad].costo) * parseInt(entrada.cantidad);
      }
    }
  }, [text, entrada, key, agregar]);

  useEffect(() => {
    //reiniciar valores para agregar nuevos productos a la tabla
    if (newJson.length !== 0) {
      setKey("");
      setAgregar("");
    }
  }, [newJson]);

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
    if (dataToEdit !== null) {
      setSearch((current) => current.filter((item) => item.id !== e.id));
      setNewJson((current) => current.filter((item) => item.id !== e.id));
    } else {
      setSearch((current) =>
        current.filter((item) => item.producto_id !== e.producto_id)
      );

      setNewJson((current) =>
        current.filter((item) => item.producto_id !== e.producto_id)
      );
    }
  };

  const columns1 = mostrarProductoEntrada(handleDelete);
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
        width={900}
      >
        <form className="modal-body">
          <div className="container">
            <label>Código</label>
            <Input
              value={parseInt(entradaId[entradaId.length - 1]?.id) + 1 || 1}
              type="text"
              name="codigo"
              disabled
              onChange={handleData}
            />
          </div>
          <div className="container">
            <label>Motivo de {tipo}</label>

            <Input
              placeholder="Motivo de entrada"
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
                  value={entrada.encargado || dni}
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
            {search.length > 0 && (
              <div className="agregar">
                <Button onClick={() => setAgregar("agregar")}>
                  <AiOutlineCheck />
                </Button>
              </div>
            )}
          </div>
        </form>
        <div className="tabla">
          {search?.length !== 0 ? (
            <Tabla columns={columns1} table={search} />
          ) : newJson.length > 0 ? (
            <Tabla columns={columns} table={newJson} />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span>No hay productos para mostrar.</span>}
            />
          )}
        </div>

        {costoTotal !== "" && costoTotal !== 0 ? (
          <label htmlFor="">
            <strong>Costo total:</strong> {costoTotal}
          </label>
        ) : (
          ""
        )}
        <div className="button-container">
          {newJson?.length !== 0 ? (
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
