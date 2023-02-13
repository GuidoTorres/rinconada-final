import React, { useEffect, useState } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const Requerimiento = ({ data }) => {
  const [newState, setNewStat] = useState([]);
  const styles = StyleSheet.create({
    page: {
      display: "flex",
      alignItems: "center",
      width: "100%",
    },
    header: {
      display: "flex",
      justifyContent: "center",
      backgroundColor: "#c5e0b3",
      width: "90%",
      marginTop: 10,
    },
    section: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      marginTop: 2,
      padding: 6,
    },
    sectionDiv: {
      display: "flex",
      flexDirection: "row",
      width: "50%",
      gap: 10,
    },
    text1: {
      fontSize: 8,
      backgroundColor: "#c5e0b3",
      textAlign: "center",
      padding: 2,
      width: "40%",
    },
    text2: {
      fontSize: 8,
      textAlign: "center",
      padding: 2,
      width: "60%",
      border: "1px solid black",
    },

    tableContainer: {
      padding: 6,
    },

    table: {
      display: "table",
      width: "auto",
      borderStyle: "solid",
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
      marginTop: 10,
    },
    tableRow: {
      margin: "auto",
      flexDirection: "row",
    },

    tableCol1: {
      width: "5%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCol2: {
      width: "45%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCol3: {
      width: "10%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableColHeader1: {
      width: "75%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      backgroundColor: "#c5e0b3",
      height: 30,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    tableColHeader2: {
      width: "25%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      backgroundColor: "#c5e0b3",
      height: 30,
    },
    tableCell: {
      margin: "auto",
      marginTop: 5,
      fontSize: 10,
    },
  });

  useEffect(() => {
    const filterData = data?.requerimiento_pedidos?.map(
      (item) => item?.requerimiento?.requerimiento_productos
    ).flat();

    setNewStat(filterData);
  }, [data]);


  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View id="header" style={styles.header}>
          <Text
            style={{
              background: "#c5e0b3",
              width: "100%",
              textAlign: "center",
              padding: "5px",
            }}
          >
            PEDIDO
          </Text>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionDiv}>
            <Text style={styles.text1}>NOMBRES SOLICITANTE</Text>
            <Text style={styles.text2}>{data.solicitante}</Text>
          </View>
          <View style={styles.sectionDiv}>
            <Text style={styles.text1}>CELULAR</Text>
            <Text style={styles.text2}>{data.celular}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionDiv}>
            <Text style={styles.text1}>ÁREA U OFICINA</Text>
            <Text style={styles.text2}>{data.area}</Text>
          </View>
          <View style={styles.sectionDiv}>
            <Text style={styles.text1}>FECHA DE PEDIDO</Text>
            <Text style={styles.text2}>{data.fecha}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionDiv}>
            <Text style={styles.text1}>PROYECTO / ACTIVIDAD</Text>
            <Text style={styles.text2}>{data.proyecto}</Text>
          </View>
          <View style={styles.sectionDiv}>
            <Text style={styles.text1}>FECHA DE ENTREGA</Text>
            <Text style={styles.text2}>21/11/2022</Text>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader1}>
                <Text style={styles.tableCell}>DETALLE DE PEDIDO</Text>
              </View>
              <View style={styles.tableColHeader2}>
                <Text style={styles.tableCell}>REGISTRO DE ALMACÉN</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol1}>
                <Text style={styles.tableCell}>Item</Text>
              </View>
              <View style={styles.tableCol2}>
                <Text style={styles.tableCell}>Descripción</Text>
              </View>
              <View style={styles.tableCol3}>
                <Text style={styles.tableCell}>Unidad</Text>
              </View>
              <View style={styles.tableCol3}>
                <Text style={styles.tableCell}>Categoria</Text>
              </View>
              <View style={styles.tableCol3}>
                <Text style={styles.tableCell}>Cantidad</Text>
              </View>
              <View style={styles.tableCol3}>
                <Text style={styles.tableCell}>Stock almacén</Text>
              </View>
              <View style={styles.tableCol3}>
                <Text style={styles.tableCell}>Cantidad a comprar</Text>
              </View>
            </View>

            {newState.length > 0  && newState?.map((data, a) => (
              <View style={styles.tableRow}>
                <View style={styles.tableCol1}>
                  <Text style={styles.tableCell}>{a+1}</Text>
                </View>
                <View style={styles.tableCol2}>
                  <Text style={styles.tableCell}>{data?.producto?.nombre}</Text>
                </View>
                <View style={styles.tableCol3}>
                  <Text style={styles.tableCell}>Unidad</Text>
                </View>
                <View style={styles.tableCol3}>
                  <Text style={styles.tableCell}>Materiales</Text>
                </View>
                <View style={styles.tableCol3}>
                  <Text style={styles.tableCell}>{data?.cantidad}</Text>
                </View>
                <View style={styles.tableCol3}>
                  <Text style={styles.tableCell}>{data?.producto?.stock}</Text>
                </View>
                <View style={styles.tableCol3}>
                  <Text style={styles.tableCell}>{data?.cantidad}</Text>
                </View>
              </View>
            ))} 
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Requerimiento;
