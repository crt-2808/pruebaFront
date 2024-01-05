import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "react-bootstrap-icons";
import Navbar from "../navbar";
import { useAuthRedirect } from "../../useAuthRedirect";
import { useUserContext } from "../../userProvider";
import axios from "axios";

// Componente principal
const Llamada_Colab = () => {
  useAuthRedirect();
  const { toggleUser, usuario } = useUserContext();
  const [registros, setRegistros] = useState([]);
  const navigate=useNavigate();
  useEffect(() => {
    const getInfo = async () => {
      Swal.fire({
        title: "Cargando...",
        text: "Por favor espera un momento",
        allowOutsideClick: false,
        timer: 1000,
      });
      Swal.showLoading();
      try {
        const response = await axios.get(
          "http://localhost:3005/Colaborador_Info",
          {
            params: { ...usuario, Tipo: "Llamada" },
          }
        );

        // Verificar si hay registros en la respuesta
        if (response.data && response.data.length > 0) {
          setRegistros(response.data);
        } else {
          // Mostrar alerta si no hay registros
          Swal.fire({
            icon: "info",
            title: "No hay registros",
            text: "No se encontraron registros para mostrar.",
          });
        }
      } catch (error) {
        console.error(
          "Error al obtener datos del procedimiento GetInfo:",
          error
        );
      }
    };

    getInfo();
  }, [usuario]); // Se ejecutará cuando el usuario cambie
  const [search, setSearch] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const filtrarRegistros = () => {
    // Filtra los registros por NombreCompleto
    const registrosFiltrados = registros.filter((registro) =>
      registro.NombreCompleto.toLowerCase().includes(busqueda.toLowerCase())
    );
    return registrosFiltrados;
  };

  const handleVerClick = (registro) => {
    navigate("/Colaborador/Incidencia", {state:{registro}})
  };
  const formatearFecha = (fecha) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Intl.DateTimeFormat("es-ES", options).format(new Date(fecha));
  };
  const obtenerEstadoRegistro = (registro) => {
    const fechaActual = new Date();
    const fechaAsignacion = new Date(registro.FechaAsignacion);
    const fechaConclusion = new Date(registro.FechaConclusion);

    if (fechaActual > fechaConclusion) {
      return <div className="alerta-esquina alerta-success">Terminado</div>;
    } else if (
      fechaActual >= fechaAsignacion &&
      fechaActual <= fechaConclusion
    ) {
      return <div className="alerta-esquina alerta-warning">En curso</div>;
    } else {
      return <div className="alerta-esquina alerta-info">Programada</div>;
    }
  };
  const alertaEsquina = (registro) => {
    <div
      className="alerta-esquina"
      style={{
        color: "white",
        backgroundColor: {
          terminado: "green",
          enCurso: "yellow",
          programada: "gray",
        }[registro.Estado],
        padding: "5px 10px",
        borderRadius: "5px",
        position: "absolute",
        top: "5px",
        right: "5px",
      }}
    >
      {registro.Estado}
    </div>;
  };
  return (
    <div className="fluid">
      <Navbar></Navbar>
      <div className="Colab">
        <div className="container-fluid px-4">
          <div className="col-md-12 d-flex justify-content-center align-items-center mb-3">
            <Link to="/Colaborador/planeador">
              <ArrowLeft className="ml-4 regreso" />
              <span id="indicador">Planeador</span>
            </Link>
          </div>
          <div className="col-12 mt-5 mb-md-1 mb-sm-0 px-4">
            <h1 className="textoSeguimiento mx-md-5 mx-sm-1">
              Llamada
            </h1>
          </div>
          <div
            className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4"
            id="contenedor"
          >
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
            {/* Renderizar la información según la existencia de registros */}
            {registros.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {registros.map((registro, index) => (
                  <div className="col-md-3" key={index}>
                    <div
                      className="card centrar p-3"
                      style={{
                        width: "15rem",
                        height: "16rem",
                        alignItems: "center",
                        overflow: "hidden",
                        marginBottom: "15px",
                        maxWidth: window.innerWidth <= 768 ? "9rem" : "100%",
                        position: "relative",
                      }}
                    >
                      <div className="alerta-esquina">
                        {obtenerEstadoRegistro(registro)}
                      </div>
                      <h2
                        className="card-title"
                        style={{
                          fontSize: "1.5rem", // Tamaño predeterminado
                          margin: 0, // Elimina cualquier margen adicional que pueda afectar
                          "@media (maxWidth: 768px)": {
                            fontSize: "1rem", // Ajusta el tamaño del texto para pantallas más pequeñas
                          },
                        }}
                      >
                        {registro.NombreCompleto}
                      </h2>
                      <h4 className="card-subtitle mb-2 text-muted">
                        {formatearFecha(registro.FechaAsignacion)}
                      </h4>
                      <p className="card-text text-truncate">
                        {registro.Telefono}
                      </p>
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
            ) : (
              // Mostrar mensaje si no hay registros
              <p>No hay registros para mostrar.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Llamada_Colab;
