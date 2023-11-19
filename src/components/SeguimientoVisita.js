import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "react-bootstrap-icons";
import Navbar from "./navbar";
import { Row, Col } from "react-bootstrap";
// Componente principal
const SeguimientoVisita = () => {
  // Estado para almacenar los datos de la base de datos
  const [registros, setRegistros] = useState([]);
  const [modoCuestionario, setModoCuestionario] = useState(false);
  const [mostrarEspera, setMostrarEspera] = useState(true);
  const [registroSeleccionado, setregistroSeleccionado] = useState(null);

  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");

  const [busqueda, setBusqueda] = useState("");

  // Función para cargar los registros desde el servidor
  const cargarRegistros = async () => {
    try {
      // Muestra el mensaje de espera al cargar registros
      Swal.fire({
        title: "Espera un momento",
        icon: "info",
        showConfirmButton: false,
        timer: 1500, // Duración de la animación en milisegundos
        willClose: () => {
          // Después de cerrar el mensaje de espera, carga los registros
          fetch("http://localhost:3005/getVisitas")
            .then((response) => response.json())
            .then((data) => {
              setRegistros(data); // Asigna los datos a la variable de estado
              setMostrarEspera(false); // Oculta el mensaje de espera
            })
            .catch((error) => {
              console.error("Error al obtener registros:", error);
              setMostrarEspera(false); // Oculta el mensaje de espera en caso de error
            });
        },
      });
    } catch (error) {
      console.error("Error al obtener registros:", error);
    }
  };

  // Efecto para cargar los registros cuando el componente se monta
  useEffect(() => {
    cargarRegistros();
  }, []);

  // Función para formatear la fecha en un formato legible
  const formatearFecha = (fecha) => {
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
        <h2>${registro.TipoEmpresa}</h2>
        <h4>${fechaFormateada}</h4>
        <p>${registro.NombreCompleto}</p>
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
        setModoCuestionario(true);
      }
    });
  };
  const handleCancelarCuestionario = () => {
    // Muestra el mensaje de espera al hacer clic en "Cancelar"
    Swal.fire({
      title: "Espera un momento",
      icon: "info",
      showConfirmButton: false,
      timer: 1500, // Duración de la animación en milisegundos
      willClose: () => {
        // Después de cerrar el mensaje de espera, vuelve al estado original
        setModoCuestionario(false);
        setMostrarEspera(false); // Oculta el mensaje de espera
      },
    });
  };

  const filtrarRegistros = () => {
    // Filtra los registros por NombreCompleto
    const registrosFiltrados = registros.filter((registro) =>
      registro.NombreCompleto.toLowerCase().includes(busqueda.toLowerCase())
    );
    return registrosFiltrados;
  };

  const handleBuscar = () => {};

  // Renderiza las seguimientovisita con los datos de la base de datos
  return (
    <div className="fluid">
      <Navbar></Navbar>
      <div className="Colab">
        <div className="container-fluid px-4">
          <div className="col-md-12 d-flex justify-content-center align-items-center mb-3">
            <Link to="/VisitaProgramada">
              <ArrowLeft className="ml-4 regreso" />
              <span id="indicador">Menu Visita Programada</span>
            </Link>
          </div>
          <div className="col-12 mt-5 mb-md-1 mb-sm-0 px-4">
            <h1 className="textoSeguimiento mx-md-5 mx-sm-1">Seguimiento</h1>
          </div>
          <div
            className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4"
            id="contenedor"
          >
            {modoCuestionario ? null :(
              <div className="row">
              <div className="col-md-6">
                <h6 className="textoBuscaSeg">
                  Selecciona el registro<br></br>para dar seguimiento
                </h6>
              </div>
              <div className="col-md-6">
                <div className="input-wrapper">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por Nombre"
                    aria-label="Buscar"
                    aria-describedby="basic-addon1"
                    value={search}
                    onChange={filtrarRegistros}
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
                    <div style={{ display: "flex", justifyContent: "center", flexWrap:"wrap" }}>
                      <Row className="mb-5">
                        <Col xs={12} md={6}>
                        <label>Nombre Completo:</label>
                        <InputText
                          value={registroSeleccionado?.NombreCompleto}
                          disabled
                          style={{ width: "100%" }}
                        />
                        <label>Empresa:</label>
                        <InputText
                          value={registroSeleccionado?.TipoEmpresa}
                          disabled
                          style={{ width: "100%" }}
                        />
                        <label>Telefono:</label>
                        <InputText
                          value={registroSeleccionado?.Telefono}
                          disabled
                          style={{ width: "100%" }}
                        />
                        <label>Sitio Web:</label>
                        <InputText
                          value={registroSeleccionado?.Sitioweb}
                          disabled
                          style={{ width: "100%" }}
                        />
                        <label>Dirreccion:</label>
                        <InputText
                          value={
                            registroSeleccionado?.Direccion_Calle +
                            " " +
                            registroSeleccionado?.Direccion_Num_Ext +
                            " " +
                            registroSeleccionado?.Direccion_Num_Int +
                            " " +
                            registroSeleccionado?.Direccion_Colonia +
                            " " +
                            registroSeleccionado?.Direccion_CP
                          }
                          disabled
                          style={{ width: "100%" }}
                        />

                        <label>Fecha Asignacion:</label>
                        <InputText
                          value={formatearFecha(registroSeleccionado?.FechaAsignacion)}
                          disabled
                          style={{ width: "100%" }}
                        />
                        </Col>
                        <Col xs={12} md={6}>
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

                        {/* Campo de texto editable */}
                        <div style={{ marginBottom: "10px" }}>
                          <label>Incidencias:</label>
                          <InputTextarea
                            autoResize={true}
                            rows={5}
                            value={registroSeleccionado?.Incidencias}
                            style={{ width: "100%" }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "10px",
                          }}
                        >
                          <Button
                            label="Guardar"
                            style={{ marginRight: "10px" }}
                          />
                          <Button
                            label="Cancelar"
                            onClick={handleCancelarCuestionario}
                          />
                        </div>
                        </Col>

                      </Row>
                    </div>
                  ) : (
                    // Renderiza la vista de seguimientovisita
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      {registros.map((registro, index) => (
                        <div className="col-md-3 " key={index}>
                          <div className="card centrar p-3">
                            <h2>{registro.TipoEmpresa}</h2>
                            <h4>{formatearFecha(registro.FechaAsignacion)}</h4>
                            <p>{registro.NombreCompleto}</p>
                            <button
                              className="btnDiario"
                              onClick={() => handleVerClick(registro)}
                            >
                              Ver
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
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
export default SeguimientoVisita;
