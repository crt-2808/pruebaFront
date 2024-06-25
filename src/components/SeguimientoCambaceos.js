import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "react-bootstrap-icons";
import Navbar from "./navbar";
import { Row, Col } from "react-bootstrap";
import { useAuthRedirect } from "../useAuthRedirect";
import { useUserContext } from "../userProvider";
import { API_URL, fetchWithToken } from "../utils/api";
import Usuario_sin_img from '../img/imagen-de-usuario-con-fondo-negro.png';
import { Tooltip } from 'primereact/tooltip';
// Componente principal
const SeguimientoCambaceos = () => {
  useAuthRedirect();
  // Estado para almacenar los datos de la base de datos
  const [registros, setRegistros] = useState([]);
  const [modoCuestionario, setModoCuestionario] = useState(false);
  const [mostrarEspera, setMostrarEspera] = useState(true);
  const [registroSeleccionado, setregistroSeleccionado] = useState(null);
  const [incidentesEditados, setIncidentesEditados] = useState("");
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [busqueda, setBusqueda] = useState("");

  // Función para cargar los registros desde el servidor
  const cargarRegistros = async () => {
    Swal.fire({
      title: "Cargando...",
      text: "Por favor espera un momento",
      allowOutsideClick: false,
    });
    Swal.showLoading();
    try {
      const response = await fetchWithToken(`${API_URL}/cambaceosPorId`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      Swal.close();

      if (!response.ok) {
        console.error("Error al obtener registros:", response);
        return Swal.fire({
          icon: "error",
          title: "Se produjo un error",
          text: "No se pudieron cargar los registros",
          timer: 2200,
          timerProgressBar: true,
        });
      }

      const data = await response.json();
      console.log(data)
      if (data.length === 0) {
        return Swal.fire({
          title: "¡Atención!",
          text: "No hay registros disponibles.",
          icon: "info",
          confirmButtonText: "Entendido",
        });
      }

      // Modificar el tipo de registro
      const registrosModificados = data.map((registro) => {
        let nuevoTipo = registro.Tipo;
        if (nuevoTipo === "Cambaceo_Semanal") {
          nuevoTipo = "Semanal";
        } else if (nuevoTipo === "Cambaceo_Diario") {
          nuevoTipo = "Diario";
        }
        return { ...registro, Tipo: nuevoTipo };
      });

      // Ordenar los registros por fecha del más reciente al más antiguo
      const registrosOrdenados = registrosModificados.sort(
        (a, b) => new Date(b.FechaAsignacion) - new Date(a.FechaAsignacion)
      );
      setRegistros(registrosOrdenados);
      setMostrarEspera(false);
    } catch (error) {
      console.error("Error al obtener registros:", error);
      Swal.close();
      return Swal.fire({
        icon: "error",
        title: "Se produjo un error",
        text: "Error al cargar los registros",
        timer: 2200,
        timerProgressBar: true,
      });
    }
  };

  // Efecto para cargar los registros cuando el componente se monta
  useEffect(() => {
    cargarRegistros();
    console.log("Estos son los registros", registros);
  }, []);

  // Función para formatear la fecha en un formato legible
  const formatearFecha = (fecha) => {
    if (!fecha) {
      return ""; // Devuelve una cadena vacía si la fecha es nula o no válida
    }
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Intl.DateTimeFormat("es-ES", options).format(new Date(fecha));
  };

  // Función para manejar el clic en el botón "Ver"
  const handleVerClick = (registro) => {
    // Formatea la fecha antes de mostrar el diálogo
    const fechaFormateada = formatearFecha(registro.FechaAsignacion);
    // Muestra el diálogo con SweetAlert2
    Swal.fire({
      icon: "warning",
      title: "Corrobora los datos seleccionados",
      html: `
        <h2>${registro.Direccion}</h2>
        <h4><h3> <span class="text-danger">Fecha Asignacion: </span></h3> ${fechaFormateada}</h4>
        <h3>Para un  <span class="text-danger">Seguimiento</span></h3>
      `,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ea4335",
      cancelButtonColor: "#333333",
    }).then((result) => {
      // Maneja la lógica después de hacer clic en Confirmar o Cancelar
      if (result.isConfirmed) {
        // Lógica para confirmar
        setregistroSeleccionado(registro);
        setIncidentesEditados(registro.Incidentes);
        setModoCuestionario(true);
      }
    });
  };
  const handleCancelarCuestionario = () => {
    setModoCuestionario(false);
  };
  const handleIncidentesChange = (e) => {
    setIncidentesEditados(e.target.value);
  };
  const handleGuardarCuestionario = async () => {
    if (incidentesEditados === registroSeleccionado?.Incidentes) {
      Swal.fire({
        icon: "error",
        title: "No se detectaron cambios",
        text: "Edita las incidencias antes de guardar.",
      });
      return;
    }
    const envioIncidentes = { Incidentes: incidentesEditados };
    try {
      const response = await fetchWithToken(
        `${API_URL}/incidencia/${registroSeleccionado.idPlanificador}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(envioIncidentes),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Incidencia registrada correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
        // Actualizar el registro en el estado local
        const registrosActualizados = registros.map((registro) => {
          if (registro.ID === registroSeleccionado.ID) {
            return { ...registro, Incidentes: incidentesEditados };
          }
          return registro;
        });
        setRegistros(registrosActualizados);
        setModoCuestionario(false);
      } else {
        console.log(response);
        const data = await response.json();
        console.log(data);
        Swal.fire({
          icon: "error",
          title: "Error al registrar la incidencia",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  const filtrarRegistros = () => {
    const registrosFiltrados = registros.filter((registro) =>
      registro.Colaboradores.some((colaborador) =>
        colaborador.NombreCompleto?.toLowerCase().includes(search.toLowerCase())
      )
    );
    setFilteredData(registrosFiltrados);
    console.log("Registros filtrados:", registrosFiltrados); // Imprimir en consola
  };

  useEffect(() => {
    filtrarRegistros();
  }, [search, registros]);

  const handleClickColaborador = (colaborador) => {
    console.log("Nombre del Colaborador:", colaborador.NombreCompleto);
    console.log("ID del Usuario:", colaborador.idUsuario);
  };
  

  return (
    <div className="fluid">
      <Navbar style={{ backgroundColor: "##F8F9FA" }}></Navbar>
      <div className="Colab" style={{ backgroundColor: "#F1F5F8" }}>
        <div className="container-fluid px-4" style={{paddingBottom:'3rem' }}>
          <div className="col-md-12 d-flex justify-content-center align-items-center mb-3">
            <Link to="/VisitaProgramada">
              <ArrowLeft className="ml-4 regreso" />
              <span id="indicador">Menu Visita Programada</span>
            </Link>
          </div>
          <div className="col-12 mt-5 mb-md-1 mb-sm-0 px-4 pt-3">
            {modoCuestionario ? (
              <h1 className="textoSeguimiento mx-md-5 mx-sm-1">
                Cambaceo {registroSeleccionado?.Tipo}
              </h1>
            ) : (
              <h1 className="textoSeguimiento mx-md-5 mx-sm-1">
                Seguimiento Cambaceos
              </h1>
            )}
          </div>
          <div
            className="container-fluid mt-md-3 mb-md-5 p-md-5 p-3 mb-4 mt-4"
            
            id="contenedor-cambaceo"
          >
            {modoCuestionario ? null : (
              <div className="row">
                <div className="col-md-6">
                  <h3 className="textoBuscaSeg">Busca tu cambaceo</h3>
                </div>
                <div className="col-md-6">
                  <div className="input-wrapper">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por Nombre de Colaborador"
                      aria-label="Buscar"
                      aria-describedby="basic-addon1"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <X className="clear-icon" onClick={() => setSearch("")} />
                  </div>
                </div>
              </div>
            )}
            <div
              className="row align-items-center mt-sm-4 mb-sm-4 mt-md-0 mb-md-0"
              id="opcionesCambaceo"
            >
              <div className="container-fluid mt-5 mb-2">
                <div className="row px-2 gy-4" id="Resultado">
                  {modoCuestionario ? (
                    // Renderiza la vista de cuestionario en dos columnas
                    <>
                      <Row className="mb-5">
                        <Col xs={12} md={6}>
                          <label>Fecha:</label>
                          <InputText
                            value={formatearFecha(
                              registroSeleccionado?.FechaAsignacion
                            )}
                            disabled
                            style={{ width: "100%" }}
                          />
                          <div style={{ marginBottom: "10px" }}>
                            <label>Descripcion:</label>
                            <InputTextarea
                              autoResize={true}
                              rows={5}
                              value={registroSeleccionado?.Descripcion}
                              style={{ width: "100%" }}
                              disabled
                            />
                          </div>
                        </Col>
                        <Col>
                          <div style={{ marginBottom: "10px" }}>
                            <label>Descripcion:</label>
                            <InputTextarea
                              autoResize={true}
                              rows={5}
                              value={"aqui va el mapa"}
                              style={{ width: "100%" }}
                              disabled
                            />
                          </div>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              marginTop: "10px",
                            }}
                          ></div>
                        </Col>
                      </Row>
                      <Row>
                        <hr />
  <div className="col-12">
    <h3 style={{ marginLeft: "15px", textAlign: "left" }}>
      Seguimiento individual
    </h3>
    <div className="d-flex flex-wrap justify-content-left">
  {registroSeleccionado?.Colaboradores.map((colaborador, idx) => (
    <div key={idx} className="colaborador-container mb-3 mx-2">
      <img
        src={colaborador.Foto}
        alt={`Avatar de ${colaborador.NombreCompleto}`}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          marginBottom: "10px",
        }}
        onError={(e) => { e.target.onerror = null; e.target.src = Usuario_sin_img; }}
        onClick={() => console.log(`Nombre: ${colaborador.NombreCompleto}, ID Usuario: ${colaborador.idUsuario}`)}
        data-pr-tooltip={colaborador.NombreCompleto}
    className="avatar-tooltip"
      />
      <Tooltip target=".avatar-tooltip" />
  
    </div>
  ))}
</div>

  </div>
</Row>


</>
                  ) : (
                   <>
                     {(filteredData.length > 0 ? filteredData : registros).map(
                        (registro, index) => {
                          const maxAvatarsToShow = 3;
                          const extraAvatars = registro.Colaboradores.length - maxAvatarsToShow;
                          return (
                            <div className="col-md-4" key={index}>
                              <div className="card custom-card centrar p-3">
                                <h2 className="card-title custom-card-title">
                                  {registro.Tipo}
                                </h2>
                                <h4 className="card-subtitle mb-2 text-muted">
                                {formatearFecha(registro.FechaAsignacion)}
                              </h4>
                                <div className="avatars-container">
                                  {registro.Colaboradores.slice(0, maxAvatarsToShow).map(
                                    (colaborador, idx) => (
                                      <img
                                        key={idx}
                                        src={colaborador.Foto}
                                        alt={`Avatar de ${colaborador.NombreCompleto}`}
                                        className="avatar"
                                        // onError={(e) => e.target.src = 'Usuario_sin_img'}
                                        onError={(e) => { e.target.onerror = null; e.target.src = Usuario_sin_img; }}
                                      />
                                    )
                                  )}
                                  {extraAvatars > 0 && (
                                    <div className="extra-avatars">
                                      +{extraAvatars}
                                    </div>
                                  )}
                                </div>
                                <button className="btn-custom" onClick={() => handleVerClick(registro)}>
                                  Ver más
                                </button>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SeguimientoCambaceos;
