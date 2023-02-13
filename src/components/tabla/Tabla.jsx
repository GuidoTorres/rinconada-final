import React from "react";
import DataTable from "react-data-table-component";
import { Empty } from "antd";

import "./tabla.css";

const Tabla = ({ columns, table, filas }) => {
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
        striped
        highlightOnHover
        responsive

        paginationComponentOptions={paginationComponentOptions}
        paginationPerPage={filas || 8}
        paginationRowsPerPageOptions={[8, 16, 24, 32, 40]}
      />
    </div>
  );
};

export default Tabla;
