import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";
import { InputTextarea } from "primereact/inputtextarea";
import Navbar from "../navbar";
import { Link } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { API_URL, fetchWithToken } from "../../utils/api";
import { Message } from "primereact/message";

const AgregarIncidencia = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [idRegistro, setIDRegistro] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [tipoEmpresa, setTipoEmpresa] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccionCompleta, setDireccionCompleta] = useState("");
  const [fechaAsignacion, setFechaAsignacion] = useState("");
  const [tipo, setTipo] = useState("");
  const [incidentesEditados, setIncidentesEditados] = useState("");
  const [idColaborador, setIDColaborador] = useState(""); // Nuevo estado para IDColaborador

  const getPlanificador = async () => {
    if (location.state && location.state.idPlanificador) {
      const ID = location.state.idPlanificador;
      setIDRegistro(ID);
      try {
        const response = await fetchWithToken(`${API_URL}/planificador/${ID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        const primerElemento = data[0];
        if (primerElemento) {
          setNombreCompleto(primerElemento.NombreCompleto);
          setTipoEmpresa(primerElemento.TipoEmpresa);
          setTelefono(primerElemento.Telefono);
          setDireccionCompleta(primerElemento.Direccion);
          setFechaAsignacion(formatoFecha(primerElemento.FechaAsignacion));
          setTipo(primerElemento.Tipo);
          setIncidentesEditados(primerElemento.Incidencia);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }

      if (location.state && location.state.idColaborador) {
        setIDColaborador(location.state.idColaborador);
        setIncidentesEditados("")
      }
    }
  };
  useEffect(() => {
    getPlanificador();
  }, [location.state]);

  const formatoFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate();
    const mes = fechaObj.getMonth() + 1; // ¡Los meses son indexados desde 0!
    const año = fechaObj.getFullYear();
    const horas = fechaObj.getHours();
    const minutos = fechaObj.getMinutes();

    // Asegúrate de agregar ceros a la izquierda si el número es menor a 10
    const formatoDia = dia < 10 ? `0${dia}` : dia;
    const formatoMes = mes < 10 ? `0${mes}` : mes;
    const formatoHoras = horas < 10 ? `0${horas}` : horas;
    const formatoMinutos = minutos < 10 ? `0${minutos}` : minutos;

    return `${formatoDia}/${formatoMes}/${año} ${formatoHoras}:${formatoMinutos}`;
  };
  // Función para construir la dirección completa

  const manejoIncidencia = () => {
    const envioIncidentes = {
      incidencia: incidentesEditados,
      idPlanificador: idRegistro,
    };
    if (idColaborador) {
      envioIncidentes.idColaborador = idColaborador;
    }
    fetchWithToken(`${API_URL}/putIncidenciasColaborador`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(envioIncidentes),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al guardar la incidencia`);
        }
        return response.json();
      })
      .then((data) => {
        Swal.fire({
          icon: "success",
          title: "Incidencia registrada con exito",
          showConfirmButton: false,
          timer: 1500,
        });
        // Retrasar la navegación a "/land" por 2 segundos
        setTimeout(() => {
          navigate("/land");
        }, 2000); // 2000 milisegundos = 2 segundos
      })

      .catch((error) => {
        console.log("Error al registrar la incidencia", error);
        Swal.fire({
          icon: "error",
          title: "Error al agregar la incidencia",
          text: "Hubo un problemma al procesar tu solicitud. Intentalo de nuevo más tarde",
        });
      });
  };
  const handleIncidentesChange = (e) => {
    setIncidentesEditados(e.target.value);
  };

  const abrirAplicacionTelefono = () => {
    window.location.href = `tel:${telefono}`;
  };
  return (
    <div className="fluid">
      <Navbar style={{ backgroundColor: "##F8F9FA" }}></Navbar>

      <div style={{ backgroundColor: "#F1F5F8" }}>
        <div
          style={{
            paddingTop: "10px",
            paddingBottom: "10px",
            backgroundColor: "#F1F5F8",
          }}
        >
          <Link to="/planeador">
            <ArrowLeft className="ml-4 regreso" />
            <span style={{ marginBottom: "100px" }} id="indicador">
              Planeador
            </span>
          </Link>
        </div>
      </div>
      <div className="py-md-4" style={{ backgroundColor: "#F1F5F8" }}>
        <div
          className="row"
          style={{
            marginLeft: "35px",
            marginBottom: "-50px",
            marginRight: "0px",
          }}
        >
          <h2 className="titulo-cambaceo px-5 ">
            Incidencia de {tipo.replace(/_/g, " ")}
          </h2>
        </div>

        <div
          className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4"
          id="contenedor-cambaceo"
        >
          {idColaborador && (
            <Message
              severity="info"
              text={`Esta incidencia se agregará al Colaborador con ID ${idColaborador}`}
            />
          )}
          <Form>
            <Row className="mb-5">
              <Col xs={12} md={6}>
                <div>
                  <h5 style={{ textAlign: "left" }}>ID</h5>
                  <InputTextarea
                    type="text"
                    placeholder="El campo no es obligatorio"
                    value={idRegistro}
                    disabled
                    className="w-100"
                    rows={1}
                  />
                </div>
                <div>
                  <h5 style={{ textAlign: "left" }}>Nombre</h5>
                  <InputTextarea
                    type="text"
                    placeholder="El campo no es obligatorio"
                    value={nombreCompleto}
                    disabled
                    className="w-100"
                    rows={1}
                  />
                </div>
                <div>
                  <h5 style={{ textAlign: "left" }}>Empresa</h5>
                  <InputTextarea
                    type="text"
                    placeholder="El campo no es obligatorio"
                    value={tipoEmpresa}
                    disabled
                    className="w-100"
                    rows={1}
                  />
                </div>
                <div>
                  <h5 style={{ textAlign: "left" }}>Telefono</h5>
                  <a
                    style={{
                      color: "blue",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                    href={`tel:${telefono}`}
                    onClick={abrirAplicacionTelefono}
                  >
                    <InputTextarea
                      type="text"
                      placeholder="El campo no es obligatorio"
                      value={telefono}
                      disabled
                      className="w-100"
                      rows={1}
                      style={{
                        color: "blue",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    />
                  </a>
                </div>
                <div>
                  <h5 style={{ textAlign: "left" }}>Direccion</h5>
                  <InputTextarea
                    type="text"
                    placeholder="El campo no es obligatorio"
                    value={direccionCompleta}
                    disabled
                    className="w-100"
                    rows={2}
                  />
                </div>
                <div>
                  <h5 style={{ textAlign: "left" }}>Fecha</h5>
                  <InputTextarea
                    type="text"
                    placeholder="El campo no es obligatorio"
                    value={fechaAsignacion}
                    disabled
                    className="w-100"
                    rows={1}
                  />
                </div>
              </Col>
              <Col xs={12} md={6}>
                  <div>
                    <h5 style={{ textAlign: "left" }}>Incidentes</h5>
                    <InputTextarea
                      type="text"
                      placeholder="Ingresa cualquier detalle relevante"
                      value={incidentesEditados}
                      onChange={handleIncidentesChange}
                      className="w-100"
                      rows={10}
                    />
                  </div>
                <button
                  type="button"
                  className="btn btn-success btn-lg"
                  onClick={manejoIncidencia}
                >
                  Agregar
                </button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AgregarIncidencia;
