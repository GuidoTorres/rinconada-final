import React from "react";
import MenuOpcion from "../menu-opciones/MenuOpcion";
import { BsTools } from "react-icons/bs";
import { BiBuildings } from "react-icons/bi";

import { GrGroup } from "react-icons/gr";
import { FaHandshake } from "react-icons/fa";

import "../../components/administracion/styles/opcionUsuario.css";
import { useContext } from "react";
import { CrudContext } from "../../context/CrudContext";

const OpcionUsuario = () => {
  const trabajador = JSON.parse(
    localStorage.getItem("permisos")
  ).personal_trabajador;
  const grupal = JSON.parse(localStorage.getItem("permisos")).personal_grupal;
  const empresa = JSON.parse(localStorage.getItem("permisos")).personal_empresa;
  const socio = JSON.parse(localStorage.getItem("permisos")).personal_socio;

  return (
    <div className="opciones-usuario">
      {trabajador ? (
        <MenuOpcion
          text={"Trabajadores"}
          path={"trabajador"}
          img={<BsTools className="icon" />}
        />
      ) : (
        ""
      )}

      {grupal ? (
        <MenuOpcion
          text={"Grupales"}
          path={"asociacion"}
          img={<GrGroup className="icon" />}
        />
      ) : (
        ""
      )}
      {empresa ? (
        <MenuOpcion
          text={"Empresas"}
          path={"empresa"}
          img={<BiBuildings className="icon" />}
        />
      ) : (
        ""
      )}

      {socio ? (
        <MenuOpcion
          text={"Socios"}
          path={"socio"}
          img={<FaHandshake className="icon" />}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default OpcionUsuario;
