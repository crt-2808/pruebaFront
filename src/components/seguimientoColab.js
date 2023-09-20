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

const SeguimientoColab = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);
  const [SemanalInicio, setSemanalInicio] = useState(null);
  const [SemanalFin, setSemanalFin] = useState(null);
  const colabInfo = async () => {
    console.log(SemanalInicio);
    if (SemanalInicio === null || SemanalFin === null) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, ingresa un rango de fechas",
      });
    } else {
      Swal.fire({
        width: 2100,
        showCancelButton: true,
        cancelButtonText: "Regresar",
        showConfirmButton: true,
        confirmButtonText: "Exportar",
        confirmButtonColor: "#ea4335",
        cancelButtonColor: "#333333",
        html: ` <div class="container-fluid my-md-5  p-md-5 p-3 mb-4  infoSeguimiento">
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
                  <h5>Ejemplo</h5>
                </div>
                <div class="col-md-6">
                  <h3>Fechas Trabajadas</h3>
                  <h5>Ejemplo</h5>
                </div>
              </div>
              <div class="row my-md-4">
                <div class="col-md-6">
                  <h3>Municipio</h3>
                  <h5>Ejemplo</h5>
                </div>
                <div class="col-md-6">
                  <h3>Colonias</h3>
                  <h5>Ejemplo</h5>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="col-md-12">
              <div class="row my-md-4">
                <div class="col-md-12">
                  <h3>Incidencias</h3>
                  <h5>Ejemplo</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
     
    </div>
    </div>`,
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
