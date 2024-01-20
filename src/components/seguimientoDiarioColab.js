import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import { ArrowLeft } from "react-bootstrap-icons";
import { useNavigate, useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Calendar } from "primereact/calendar";
import "../theme.css";
import "primereact/resources/primereact.css"; // core css
import { CalendarioEsp } from "../utils/calendarLocale";
import { API_URL, fetchWithToken } from "../utils/api";
const convierteFecha = (fecha) => {
  const dateObj = new Date(fecha);
  const year = dateObj.getUTCFullYear();
  const month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2);
  const day = ("0" + dateObj.getUTCDate()).slice(-2);
  const hours = ("0" + dateObj.getUTCHours()).slice(-2);
  const minutes = ("0" + dateObj.getUTCMinutes()).slice(-2);
  const seconds = ("0" + dateObj.getUTCSeconds()).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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

const cambaceosColabTemplate = (cambaceo) => {
  return `
  <div class="container-fluid my-md-5  p-md-5 p-3 mb-4  infoSeguimiento">
      <div class="row">
          <div class="col-md-12">
              <h1 class=" mx-5">Información</h1>
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
                  <h3>Incidencias</h3>
                  <textarea id="incidencias-${
                    cambaceo.ID
                  }" rows='5' style="border: 1px solid #f44336;" class="form-control">${
    cambaceo.Incidentes || "Ninguna"
  }</textarea>
                  <button id="guardar-${
                    cambaceo.ID
                  }" class="btn-exportar mt-4" onclick="guardarIncidencia(${
    cambaceo.ID
  })">Guardar</button>
                </div>
                  </div>
              </div>
          </div>
      </div>
  </div>`;
};
const cambaceosTemplate = (cambaceo) => {
  return `
  <div class="container-fluid my-md-5  p-md-5 p-3 mb-4  infoSeguimiento">
      <div class="row">
          <div class="col-md-12">
              <h1 class=" mx-5">Información</h1>
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
                  <h3>Descripción</h3>
                  <h5>${cambaceo.Descripcion}</h5>
                  <br>
                  <h3>Incidencias</h3>
                  <h5>${cambaceo.Incidentes || "Ninguna"}</h5>
                </div>
                  </div>
              </div>
          </div>
      </div>
  </div>`;
};
const SeguimientoDiarioColab = () => {
  const navigate = useNavigate();
  CalendarioEsp();
  const { id } = useParams();

  const [Diario, setDiario] = useState(null);

  const guardarIncidencia = async (id) => {
    const incidencias = document.getElementById(`incidencias-${id}`).value;
    console.log(incidencias);
    try {
      const response = await fetchWithToken(`${API_URL}/incidencias`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, incidencia: incidencias }),
      });

      if (!response.ok) {
        Swal.fire({
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

      let data;
      if (response.headers.get("content-length") !== "0") {
        data = await response.json();
      } else {
        data = "No content";
      }

      console.log("Incidencias guardadas:", data);
      Swal.fire({
        icon: "success",
        title: "¡Incidencias actualizadas!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error al guardar las incidencias:", error);
      Swal.fire({
        icon: "error",
        title: "Error al guardar las incidencias",
        text: error.toString(),
      });
    }
  };

  const colabInfo = async () => {
    if (Diario === null) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, ingresa un rango de fechas",
      });
      return;
    }
    const fechaFormateada = formateoFecha(Diario);
    console.log("Después de formatear: ", fechaFormateada);
    let data = { id: id, fecha: fechaFormateada };
    console.log(data);
    let config = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(data),
    };

    Swal.fire({
      title: "Cargando...",
      text: "Por favor espera un momento",
      allowOutsideClick: false,
    });
    Swal.showLoading();

    let res = await fetchWithToken(`${API_URL}/seguimientoDiario`, config);

    Swal.close();

    let json = await res.json();
    // Convertir las fechas al formato deseado
    json = json.map((item) => {
      item.FechaAsignacion = convierteFecha(item.FechaAsignacion);
      item.FechaConclusion = convierteFecha(item.FechaConclusion);
      return item;
    });
    console.log(json);
    if (json === null || (Array.isArray(json) && json.length === 0)) {
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
    let templates = json.map(cambaceosTemplate);
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
        exportToCSV(json);
        console.log("Confirmado");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("Cancelado");
      }
    });
  };
  useEffect(() => {
    // Hacer que la función guardarIncidencia esté disponible globalmente
    window.guardarIncidencia = guardarIncidencia;
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
                  <h3>Seleccione la fecha deseada</h3>
                  <div className="row centrar" style={{ overflow: "hidden" }}>
                    <div className="col-md-6">
                      <Calendar
                        id="Diario"
                        value={Diario}
                        onChange={(e) => {
                          setDiario(e.value);
                        }}
                        locale="es"
                        className="custom-calendar"
                        showIcon
                        touchUI
                        placeholder="Ingresa la fecha deseada"
                      />
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

export default SeguimientoDiarioColab;
