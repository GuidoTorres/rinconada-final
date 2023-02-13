import React, { useContext } from "react";
import DataTable from "react-data-table-component";
import "./tabla.css";

const TablaRequerimientos = ({ columns, table, set }) => {
  const handleChange = ({ selectedRows }) => {
    set(selectedRows);
  };

  const rowDisabledCriteria = (row) =>
    row.estado !== "1" || row.completado === true;

  const expandedComponent = ({ data }) => (
    <div style={{ padding: "10px 20px 10px 60px" }}>
      {console.log(data)}
      <div style={{ marginTop: "5px" }}>
        <label htmlFor="">{data.solicitante}</label>
        <label htmlFor="">{data.celular}</label>

        <table>
          <tr>
            <td style={{width:"140px", textAlign:"center"}}>
              <strong>Fecha de pedido</strong>
            </td>
            <td style={{width:"240px", textAlign:"center"}}>
              <strong>Producto</strong>
            </td>
            <td style={{width:"180px", textAlign:"center"}}>
              <strong>Cantidad</strong>
            </td>
          </tr>
          {data.requerimiento_productos.map((item, i) => (
            <tr key={i}>
              <td style={{textAlign:"center"}}>{data.fecha_pedido}</td>
              <td style={{textAlign:"center"}}>{item.producto.nombre}</td>
              <td style={{textAlign:"center"}}>{item.cantidad}</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );

  const paginationComponentOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: false,
    selectAllRowsItemText: "Todos",
  };
  return (
    <div className="table-container">
      <DataTable
        columns={columns}
        data={table}
        pagination
        fixedHeader
        striped
        highlightOnHover
        selectableRows
        expandableRows
        expandableRowsComponent={expandedComponent}
        expandableRowDisabled={(row) => row?.completado === 1}
        paginationComponentOptions={paginationComponentOptions}
        responsive
        noHeader={true}
        noDataComponent={"No se encontraron resultados."}
        onSelectedRowsChange={handleChange}
        selectableRowDisabled={rowDisabledCriteria}
      />
    </div>
  );
};

export default TablaRequerimientos;
