import React, { useEffect, useState, useRef } from "react";
import Navbar from "./navbar";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, X, Download } from "react-bootstrap-icons";
import { Tooltip } from "primereact/tooltip";
import usuarioAnon from "../img/imagen-de-usuario-con-fondo-negro.png";
import Swal from "sweetalert2";
import { Toast } from "primereact/toast";
import { useAuthRedirect } from "../useAuthRedirect";
import axios from "axios";
import "../theme.css";
import "primereact/resources/primereact.css"; // core css

const SeguimientoCambaceo = () => {
  useAuthRedirect();
  const navigate = useNavigate();

  // Nuevo estado para los datos de los colaboradores
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [imageLoaded, setImageLoaded] = useState({});
  const [descargando, setDescargando] = useState(false);
  const userData = JSON.parse(sessionStorage.getItem("usuario"));
  const email = userData.email;

  const requestBody = {
    correoLider: email,
  };

  const toast = useRef(null);
  const showToast = () => {
    toast.current.show({
      severity: "warn",
      summary: "Error",
      detail: "No logramos acceder a la imagen del colaborador.",
      life: 2000,
    });
  };
  const handleImageError = (e) => {
    e.target.src = usuarioAnon; // imagen predeterminada
  };
  const generateSwalTemplate = (colaborador, type) => {
    return `
      <h3>Has seleccionado</h3>
      <div class='row centrar' style='overflow: hidden;'>
        <div class='col-md-8 col-xs-6'>
          <div class='card centrar p-3 mt-3'>
            
              <img src='${
                colaborador.Imagen
              }' class='img-fluid' id='img-card' alt="imagen de colaborador" onerror="this.onerror=null; this.src='${usuarioAnon}';">
            <h3>${colaborador.Nombre}</h3>
            <h4>${
              colaborador.Apellido_pat + " " + colaborador.Apellido_mat
            }</h4>
            <h6>${colaborador.Correo}</h6>
            <h6>${colaborador.Telefono}</h6>
          </div>
        </div>
      </div>
      <br>
      <h3>Para un seguimiento <span class="text-danger">${type}</span></h3>
    `;
  };

  const colab = async () => {
    Swal.fire({
      title: "Cargando...",
      text: "Por favor espera un momento",
      allowOutsideClick: false,
    });
    Swal.showLoading();
    try {
      const options = {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      };
      const response = await fetch(
        "https://sarym-production-4033.up.railway.app/api/colaborador",
        options
      );
      Swal.close();
      if (
        response.status == 500 ||
        response.status == 404 ||
        response.status == 400
      ) {
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
      const data = await response.json();
      if (data.length === 0) {
        return Swal.fire({
          title: "¡Atención!",
          text: "Todavía no hay ningún colaborador registrado en tu equipo.",
          icon: "info",
          confirmButtonText: "Entendido",
        });
      }
      // Transformamos la data si es necesario
      const transformedData = data.map((item) => {
        if (item.Imagen === "src") {
          return { ...item, Imagen: usuarioAnon };
        }
        return item;
      });
      setData(transformedData);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Algo salió mal al cargar los colaboradores!",
      });
    }
  };

  const handleClick = (type, colaborador) => {
    // showToast();
    Swal.fire({
      title: "Corrobora los datos",
      text: "Fecha",
      icon: "warning",
      showCancelButton: true,
      html: generateSwalTemplate(colaborador, type),
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ea4335",
      cancelButtonColor: "#333333",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/SeguimientoCambaceo/${type}/${colaborador.id}`);
      }
    });
  };

  useEffect(() => {
    colab();
  }, []);
  useEffect(() => {
    const filteredColab = data.filter((colaborador) =>
      colaborador.Nombre.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filteredColab);
  }, [search, data]);
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handleDownload = async () => {
    Swal.fire({
      title: "Descargando...",
      text: "Por favor espera un momento",
      allowOutsideClick: false,
    });
    Swal.showLoading();
    try {
      const response = await axios.post(
        "https://sarym-production-4033.up.railway.app/api/cambaceo/descargaFechas",
        requestBody,
        { responseType: "blob" }
      );
      Swal.close();
      if (response.status === 204) {
        return Swal.fire({
          icon: "info",
          title: "Información",
          text: "No hay registros para la próxima semana aún.",
        });
      }

      // Crear un objeto URL para el blob y simular un clic para iniciar la descarga
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resultado_consulta.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      Swal.close();
      console.error("Error al descargar el archivo CSV:", error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Algo salió mal al descargar el archivo CSV!",
      });
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="fluid">
      <Navbar></Navbar>
      <Toast ref={toast} />

      <div className="Colab">
        <div className="container-fluid px-4">
          <div className="row table_space mt-4">
            <div className="col-md-12 d-flex justify-content-center align-items-center mb-3">
              <Link to="/cambaceo">
                <ArrowLeft className="ml-4 regreso" />
                <span id="indicador">Cambaceo</span>
              </Link>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center col-12 mt-5 mb-md-1 mb-sm-0 px-4">
            <h1 className="textoSeguimiento mx-md-5 mx-sm-1">Seguimiento</h1>
            <Download
              className="descarga-cambaceo"
              onClick={handleDownload}
              data-pr-tooltip="Descarga el cambaceo semanal de la próxima semana"
              data-pr-position="top"
            />
            <Tooltip target=".descarga-cambaceo" className="custom-tooltip" />
          </div>
          <div
            className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4"
            id="contenedor"
          >
            <div className="row">
              <div className="col-md-6">
                <h6 className="textoBuscaSeg">
                  Selecciona al colaborador<br></br>y el tipo de seguimiento
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
                    onChange={handleSearchChange}
                  />
                  <X className="clear-icon" onClick={() => setSearch("")} />
                </div>
              </div>
            </div>
            <div
              className="row align-items-center mt-sm-4 mb-sm-4 mt-md-0 mb-md-0"
              id="opcionesCambaceo"
            >
              <div className="container-fluid mt-5 mb-2">
                <div className="row px-2 gy-4" id="Resultado">
                  {filteredData.length > 0 ? (
                    filteredData.map((colaborador, index) => (
                      <div className="col-md-3 " key={index}>
                        <div className="card centrar p-3">
                          <div
                            className="loader-container"
                            style={{
                              display: imageLoaded[colaborador.id]
                                ? "none"
                                : "block",
                            }}
                          >
                            <span className="loader"></span>
                            <div className="loader-text">
                              Cargando imagen del colaborador...
                            </div>
                          </div>

                          <img
                            src={colaborador.Imagen}
                            className={`img-fluid fade-in ${
                              imageLoaded[colaborador.id] ? "loaded" : ""
                            }`}
                            id="img-card"
                            alt="imagen de colaborador"
                            onError={handleImageError}
                            onLoad={() =>
                              setImageLoaded((prevState) => ({
                                ...prevState,
                                [colaborador.id]: true,
                              }))
                            }
                            style={
                              imageLoaded[colaborador.id]
                                ? { opacity: 1, visibility: "visible" }
                                : {
                                    opacity: 0,
                                    visibility: "hidden",
                                    display: "none",
                                  }
                            }
                          />

                          <h3>{colaborador.Nombre}</h3>
                          <h4>
                            {colaborador.Apellido_pat +
                              " " +
                              colaborador.Apellido_mat}
                          </h4>
                          <h6 className="email">{colaborador.Correo}</h6>
                          <h6>{colaborador.Telefono}</h6>
                          <div className="col-md-12">
                            <div className="row">
                              <div className="col-md-12">
                                <button
                                  className="btnDiario"
                                  onClick={() =>
                                    handleClick("Diario", colaborador)
                                  }
                                >
                                  Diario
                                </button>
                                <button
                                  className="btnSemanal mt-md-2 mt-sm-0"
                                  onClick={() =>
                                    handleClick("Semanal", colaborador)
                                  }
                                >
                                  Semanal
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>
                      No se encontró ningún colaborador con el nombre "{search}
                      ".
                    </p>
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
export default SeguimientoCambaceo;
