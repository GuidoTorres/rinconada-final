import { utils, writeFileXLSX } from "xlsx";
export const handleDownloadExcel = (dataSource, sheetName, fileName) => {
  const formatData = dataSource?.map((item, i) => {
    return {
      Nro: i + 1,
      DNI: item.dni,
      NOMBRE: item.nombre,
      FECHA_NACIMIENTO: item?.fecha_nacimiento?.split("T")[0],
      CELULAR: item.telefono,
      CARGO: item?.puesto,
      ÁREA: item.dni,
      COOPERATIVA: item.dni,
      FECHA_DE_INGRESO: item?.fecha_inicio?.split("T")[0],
      VOLQUETE: item.volquete,
      TELETRAN: item.teletran,
      PERIODO_DE_TRABAJO: item.asistencia,
      FECHA_DE_SALIDA: item?.fecha_fin?.split("T")[0],
      ANTECEDENTES: item.dni,
      RECOMENDADO_POR: item.dni,
      PROXIMA_QUINCENA: item.dni,
      NUMERO_DE_QUINCENAS_TRABAJADOS: item.dni,
    };
  });

  const ws = utils.json_to_sheet(formatData);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, sheetName);
  writeFileXLSX(wb, `${fileName}.xlsx`);
};
