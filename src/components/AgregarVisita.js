import React, { useState } from "react";
import Navbar from "./navbar";
import { Link } from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import { Calendar } from "primereact/calendar";
import "../theme.css";
import "primereact/resources/primereact.css"; // core css
import { addLocale } from "primereact/api";
addLocale("es", {
  firstDayOfWeek: 1,
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ],
  today: "Hoy",
  clear: "Limpiar",
});
const formateoFecha = (fechaI) => {
  const year = fechaI.getFullYear();
  const month = ("0" + (fechaI.getMonth() + 1)).slice(-2);
  const day = ("0" + fechaI.getDate()).slice(-2);
  const hours = ("0" + fechaI.getHours()).slice(-2);
  const minutes = ("0" + fechaI.getMinutes()).slice(-2);
  const seconds = ("0" + fechaI.getSeconds()).slice(-2);
  const FechaNueva = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return FechaNueva;
};

const AgregarVisita = () => {
  const [FechaProgramada, setFechaProgramada] = useState(null);
  const fechaRegistrada = () => {
    if (FechaProgramada === null) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ingresa una fecha",
      });
    } else {
      const fecha = formateoFecha(FechaProgramada);
      console.log(fecha);
    }
  };
  return (
    <div className="fluid">
      <Navbar></Navbar>
      <Link to="/VisitaProgramada">
        <ArrowLeft className="ml-4 regreso" />
        <span id="indicador">Visita</span>
      </Link>

      <div className="col-12  todo" style={{ height: "90vh" }}>
        <div
          className="container mt-sm-5 mt-md-2 mb-4 p-5"
          id="contenedor-land"
        >
          <div className="row">
            <div className="col-12 text-left">
              <h2 className="tituloPlaneador">Visita</h2>
            </div>
          </div>
          <div className="row pt-md-3  pb-md-4 mb-md-3">
            <div className="col-md-12">
              <div className="row no-padding">
                <div className="col-12">
                  <div className="row no-padding pt-5 pl-0 pr-0">
                    <h3>
                      Ingresa la fecha que <br></br> deseas programar
                    </h3>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row no-padding justify-content-center pt-5 pl-0 pr-0">
                    <div className="col-md-5 col-sm-12">
                      <Calendar
                        value={FechaProgramada}
                        onChange={(e) => {
                          setFechaProgramada(e.value);
                        }}
                        locale="es"
                        className="custom-calendar"
                        showIcon
                        touchUI
                        placeholder="Ingresa la fecha programada"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-12 justify-content-end d-flex">
              <div className="col-md-4">
                <Link to="/VisitaProgramada">
                  <button className="btn-regreso">Cancelar</button>
                </Link>
                <button
                  className="btn-exportar"
                  id="Buscar"
                  onClick={fechaRegistrada}
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgregarVisita;
