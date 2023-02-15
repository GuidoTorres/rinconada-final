import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "./tabla.css";
import {
  AiFillEdit,
  AiFillEye,
  AiOutlineCheck,
  AiOutlineClose,
} from "react-icons/ai";
import { BsFillTrash2Fill } from "react-icons/bs";
import ModalRegistroPersonal from "../personal/trabajadores/ModalRegistroPersonal";
import { CrudContext } from "../../context/CrudContext";
import ModalHistorialEvaluacion from "../personal/trabajadores/ModalHistorialEvaluacion";
import { notificacion } from "../../helpers/mensajes";
import { Empty } from "antd";

const Tabla = ({ columns, table, actualizarTabla }) => {
  const route = "trabajador";
  const {
    deleteData,
    updateData,
    setData,
    setModal,
    setModal1,
    modal,
    modal1,
    setDataToEdit,
  } = useContext(CrudContext);
  const [id, setId] = useState("");

  const handleEdit = (e) => {
    setDataToEdit(e);
    setModal(true);
  };

  const paginationComponentOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  const handleDelete = async (e) => {

    const response = await deleteData(route, e);
    console.log('====================================');
    console.log(response);
    console.log('====================================');
    if (response) {
      notificacion(response.status, response.msg);
      actualizarTabla();
    }
  };
  const handleEvaluacion = (e) => {
    setModal1(true);
    setId(e);
  };
  const personal = [
    {
      id: "codigo",
      name: "Código",
      selector: (row, index) => row.codigo_trabajador,
      sortable: true,
    },
    {
      id: "foto",
      name: "Foto",
      selector: (row) => (
        <div style={{ padding: "3px" }}>
          <img
            alt=""
            src={row?.foto || "https://via.placeholder.com/80"}
            style={{ height: "60px", width: "80px" }}
          ></img>
        </div>
      ),
      width: "100px",
    },
    {
      id: "Trabajador",
      name: "Trabajador",
      selector: (row) =>
        row?.nombre + " " + row?.apellido_paterno + " " + row?.apellido_materno,
      width: "300px",
      center: true,
      sortable: true,
    },
    {
      id: "Campamento",
      name: "Campamento",
      selector: (row) => (!row?.campamento ? "Por asignar" : row?.campamento),
      sortable: true,
    },
    {
      id: "Dni",
      name: "Dni",
      selector: (row) => row?.dni,
      sortable: true,
    },
    {
      id: "telefono",
      name: "Telefono",
      selector: (row) => row?.telefono,
      sortable: true,
    },

    {
      id: "Evaluación",
      name: "Evaluación",
      selector: (row) => row?.id,

      button: true,
      cell: (e, index) => (
        <>
          <AiFillEye onClick={() => handleEvaluacion(e)} />
          {e?.evaluacion?.at(-1)?.fiscalizador_aprobado === "si" &&
          e?.evaluacion?.at(-1)?.control === "si" &&
          e?.evaluacion?.at(-1)?.topico === "si" &&
          e?.evaluacion?.at(-1)?.seguridad === "si" &&
          e?.evaluacion?.at(-1)?.medio_ambiente === "si" &&
          e?.evaluacion?.at(-1)?.recursos_humanos === "si" &&
          !e?.evaluacion?.at(-1)?.finalizado ? (
            <AiOutlineCheck
              style={{ color: "green", fontWeigth: "bold", fontSize: "16px" }}
            />
          ) : e?.evaluacion?.at(-1)?.id &&
            !e?.evaluacion?.at(-1)?.finalizado ? (
            <AiOutlineClose
              style={{ color: "red", fontWeigth: "bold", fontSize: "16px" }}
            />
          ) : (
            ""
          )}
        </>
      ),
    },

    {
      id: "Acciones",
      name: "Acciones",
      button: true,
      cell: (e) => (
        <>
          <AiFillEdit onClick={() => handleEdit(e)} />
          <BsFillTrash2Fill onClick={() => handleDelete(e.dni)} />
        </>
      ),
    },
  ];

  const expandedComponent = ({ data }) => (
    <div style={{ padding: "10px 20px 10px 20px" }}>
      <DataTable
        columns={personal}
        data={data.trabajador}
        pagination
        paginationPerPage={6}
        noDataComponent={
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>No hay registros para mostrar.</span>}
          />
        }
        paginationComponentOptions={paginationComponentOptions}
        paginationRowsPerPageOptions={[6, 10, 15, 20]}
      />
    </div>
  );

  return (
    <div className="table-container">
      <DataTable
        columns={columns}
        data={table}
        pagination
        fixedHeader
        striped
        highlightOnHover
        expandableRows
        expandableRowsComponent={expandedComponent}
        expandableRowDisabled={(row) =>
          row?.trabajador?.length === 0 ? true : false
        }
        paginationComponentOptions={paginationComponentOptions}
        responsive
        noHeader={true}
        noDataComponent={"No se encontraron resultados."}
      />

      {modal && <ModalRegistroPersonal actualizarTabla={actualizarTabla} />}
      {modal1 && <ModalHistorialEvaluacion selected={id} />}
    </div>
  );
};

export default Tabla;
