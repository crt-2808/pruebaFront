import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import { ArrowLeft } from "react-bootstrap-icons";
import { useNavigate, useParams, Link } from "react-router-dom";
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
const exportToCSV = (data) => {
  const csvData =
    `Nombre,Fecha Inicio,Fecha Fin,Calle,Colonia,Incidencias\n` +
    data
      .map(
        (item) =>
          `"${item.NombreCompleto}",${item.FechaAsignacion},${
            item.FechaConclusion
          },"${item.Direccion_Calle} ${item.Direccion_Num_Ext}","${
            item.Direccion_Colonia
          }","${item.Incidentes || "Ninguna"}"`
      )
      .join("\n");

  const blob = new Blob([csvData], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = "seguimiento.csv";

  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
};

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
const cambaceosTemplate = (cambaceo) => {
  return `
  <div class="container-fluid my-md-5  p-md-5 p-3 mb-4  infoSeguimiento">
      <div class="row">
          <div class="col-md-12">
              <h1 class=" mx-md-5 mx-sm-2 text-center text-md-start">Información</h1>
          </div>
          <div class="col-md-12 mt-md-4">
              <div class="row">
                  <div class="col-md-8">
                      <div class="col-md-12">
                          <div class="row my-md-4">
                              <div class="col-md-6">
                                  <h3>Nombre</h3>
                                  <h5>${cambaceo.NombreCompleto}</h5>
                              </div>
                              <div class="col-md-6">
                                  <h3>Fechas Trabajadas</h3>
                                  <h5>${cambaceo.FechaAsignacion} - <br> ${
    cambaceo.FechaConclusion
  }</h5>
                              </div>
                          </div>
                          <div class="row my-md-4">
                              <div class="col-md-6">
                                  <h3>Calle</h3>
                                  <h5>${cambaceo.Direccion_Calle} ${
    cambaceo.Direccion_Num_Ext
  }</h5>
                              </div>
                              <div class="col-md-6">
                                  <h3>Colonias</h3>
                                  <h5>${cambaceo.Direccion_Colonia}</h5>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="col-md-4">
                      <div class="col-md-12">
                          <div class="row my-md-4">
                              <div class="col-md-12">
                                  <h3>Incidencias</h3>
                                  <h5>${cambaceo.Incidentes || "Ninguna"}</h5>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>`;
};
const SeguimientoColab = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);
  const [SemanalInicio, setSemanalInicio] = useState(null);
  const [SemanalFin, setSemanalFin] = useState(null);
  const colabInfo = async () => {
    const FechaInicio = formateoFecha(SemanalInicio);
    const FechaFin = formateoFecha(SemanalFin);
    const Tipo = "Cambaceo_Semanal";
    console.log("Fecha Inicio", FechaInicio);
    console.log("Fecha Fin", FechaFin);

    let data = { FechaInicio, FechaFin, Tipo, id };
    console.log("Data", data);
    if (SemanalInicio === null || SemanalFin === null) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, ingresa un rango de fechas",
      });
    } else {
      Swal.fire({
        title: "Cargando...",
        text: "Por favor espera un momento",
        allowOutsideClick: false,
      });
      Swal.showLoading();
      let config = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(data),
      };
      let res = await fetch(
        "https://sarym-production-4033.up.railway.app/api/cambaceo/seguimientoSemanal",
        config
      );
      Swal.close();
      let cambaceos = await res.json();
      cambaceos = cambaceos.map((cambaceo) => {
        const fechaInicio = new Date(cambaceo.FechaAsignacion);
        const fechaFin = new Date(cambaceo.FechaConclusion);

        cambaceo.FechaAsignacion = `${fechaInicio.getUTCFullYear()}-${(
          "0" +
          (fechaInicio.getUTCMonth() + 1)
        ).slice(-2)}-${("0" + fechaInicio.getUTCDate()).slice(-2)} ${(
          "0" + fechaInicio.getUTCHours()
        ).slice(-2)}:${("0" + fechaInicio.getUTCMinutes()).slice(-2)}:${(
          "0" + fechaInicio.getUTCSeconds()
        ).slice(-2)}`;

        cambaceo.FechaConclusion = `${fechaFin.getUTCFullYear()}-${(
          "0" +
          (fechaFin.getUTCMonth() + 1)
        ).slice(-2)}-${("0" + fechaFin.getUTCDate()).slice(-2)} ${(
          "0" + fechaFin.getUTCHours()
        ).slice(-2)}:${("0" + fechaFin.getUTCMinutes()).slice(-2)}:${(
          "0" + fechaFin.getUTCSeconds()
        ).slice(-2)}`;

        return cambaceo;
      });
      console.log(cambaceos);
      if (
        cambaceos === null ||
        (Array.isArray(cambaceos) && cambaceos.length === 0)
      ) {
        return Swal.fire({
          icon: "info",
          title: "Información",
          text: "No hay nada reportado para esas fechas",
        });
      }
      if (res.status == 500 || res.status == 404 || res.status == 400) {
        return Swal.fire({
          icon: "error",
          title: "Se produjo un error",
          text: "UDA",
          timer: 1200,
          timerProgressBar: true,
          backdrop: `
          rgba(36,32,32,0.65)
          
        `,
        });
      }
      let templates = cambaceos.map(cambaceosTemplate);
      let combinedTemplate = templates.join("");

      Swal.fire({
        width: 2100,
        showCancelButton: true,
        cancelButtonText: "Regresar",
        showConfirmButton: true,
        confirmButtonText: "Exportar",
        confirmButtonColor: "#ea4335",
        cancelButtonColor: "#333333",
        html: combinedTemplate,
      }).then(async (result) => {
        if (result.isConfirmed) {
          exportToCSV(cambaceos);
          console.log("Confirmado");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          console.log("Cancelado");
        }
      });
    }
  };
  useEffect(() => {
    // colabInfo();
  }, []);
  return (
    <div className="fluid">
      <Navbar></Navbar>
      <div className="Colab">
        <div className="container-fluid px-4">
          <div className="row table_space mt-4">
            <div className="col-md-12 d-flex justify-content-center align-items-center mb-3">
              <Link to="/SeguimientoCambaceo">
                <ArrowLeft className="ml-4 regreso" />
                <span id="indicador">Seguimiento</span>
              </Link>
            </div>
          </div>
          <div
            className="container-fluid mt-md-5 mb-md-5 px-md-5 py-md-3 p-3 mb-4 mt-4"
            id="contenedor"
          >
            <div className="row">
              <h2 className="titulo-cambaceo ">Seguimiento</h2>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="row centrar">
                  <h3>Seleccione el rango de fechas</h3>
                  <div className="row centrar" style={{ overflow: "hidden" }}>
                    <div className="col-md-6">
                      <div className="col-md-12">
                        <Calendar
                          id="SemanalInicio"
                          value={SemanalInicio}
                          onChange={(e) => {
                            setSemanalInicio(e.value);
                          }}
                          locale="es"
                          className="custom-calendar"
                          showIcon
                          touchUI
                          placeholder="Ingresa la fecha de inicio"
                        />
                      </div>
                      <div className="col-md-12">
                        <Calendar
                          id="SemanalFin"
                          value={SemanalFin}
                          onChange={(e) => {
                            setSemanalFin(e.value);
                          }}
                          locale="es"
                          className="custom-calendar"
                          showIcon
                          touchUI
                          placeholder="Ingresa la fecha de fin"
                          minDate={
                            SemanalInicio
                              ? new Date(SemanalInicio.getTime() + 86400000)
                              : null
                          }
                        />
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-12 justify-content-end d-flex">
                        <div className="col-md-4">
                          <Link to="/SeguimientoCambaceo">
                            <button className="btn-regreso">Cancelar</button>
                          </Link>
                          <button
                            className="btn-exportar"
                            id="Buscar"
                            onClick={colabInfo}
                          >
                            Buscar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeguimientoColab;
