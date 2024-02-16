import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";
import axios from "axios";
import { Form, Button, Row, Col } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import { InputTextarea } from "primereact/inputtextarea";
import Navbar from "../navbar";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../../theme.css";
import "primereact/resources/primereact.css"; // core css
import { addLocale } from "primereact/api";

const mapboxToken =
  "pk.eyJ1IjoiZGllZ28tdWRhIiwiYSI6ImNscnp0bDg3ZTIxcm8ya3J6emI5YzB6dzIifQ.XfVLD6ewyxMC63V_hUKtRQ";
const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });

function Colab_PruebaMaps() {
  // Almacena la informacion del registro seleccionado
  const location = useLocation();
  const navigate = useNavigate();
  const [registro, setRegistro] = useState(null);
  const [direccionCompleta, setDireccionCompleta] = useState("");
  const [TipoEmpresa, setTipoEmpresa] = useState("");
  const [Telefono, setTelefono] = useState("");
  const [Descripcion, setDescripcion] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horario, setHorario] = useState("");
  const [horaConlcusion, setHoraConclusion] = useState("");

  const [coordinates, setCoordinates] = useState({
    latitude: 26.084241,
    longitude: -98.303863,
  });

  const dividirFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate();
    const mes = fechaObj.getMonth() + 1;
    const año = fechaObj.getFullYear();
    return `${dia}/${mes}/${año}`;
  };

  const dividirHora = (fecha) => {
    const fechaObj = new Date(fecha);
    const horas = fechaObj.getHours();
    const minutos = fechaObj.getMinutes();
    return `${horas < 10 ? "0" : ""}${horas}:${
      minutos < 10 ? "0" : ""
    }${minutos}`;
  };

  useEffect(() => {
    // Verificamos si existe el objeto registro en location.state
    if (location.state && location.state.registro) {
      const {
        Direccion,
        TipoEmpresa,
        Telefono,
        FechaAsignacion,
        FechaConclusion,
        Descripcion,
        idPlanificador,
      } = location.state.registro;

      setDireccionCompleta(Direccion || "");
      obtenerCoordenadas(direccionCompleta);
      setTipoEmpresa(TipoEmpresa || "");
      setTelefono(Telefono || "");
      setDescripcion(Descripcion || "");
      setHoraInicio(horaInicio || "");
      setHoraConclusion(horaInicio || "");
      setHorario(horario || "");

      // Divide la fecha para "Fecha Inicio"
      setHoraInicio(dividirFecha(FechaAsignacion));
      // Divide la fecha para "Fecha Fin"
      setHoraConclusion(dividirFecha(FechaConclusion));
      // Divide las horas para "Horario"
      setHorario(
        `${dividirHora(FechaAsignacion)} - ${dividirHora(FechaConclusion)}`
      );

      // Almacena el objeto registro en el estado
      setRegistro(location.state.registro);
    }
  }, [location.state]);

  // Componentes de la direccion
  const [map, setMap] = useState(null);
  const onLoad = (map) => {
    setMap(map);
  };
  const onUnmount = () => {
    setMap(null);
  };

  const obtenerCoordenadas = async (direccionCompleta) => {
    try {
      const response = await geocodingClient
        .forwardGeocode({
          query: direccionCompleta,
          limit: 1,
          language: ["es"],
        })
        .send();

      if (
        response &&
        response.body &&
        response.body.features &&
        response.body.features.length > 0
      ) {
        const { center } = response.body.features[0];
        setCoordinates({ latitude: center[1], longitude: center[0] });
      } else {
        console.error(
          "No se encontraron coordenadas para la dirección proporcionada."
        );
      }
    } catch (error) {
      console.error("Error al obtener coordenadas:", error);
    }
  };

  const handleIncidenciaClick = (registro) => {
    navigate("/Colaborador/Incidencia", { state: { registro } });
  };

  useEffect(() => {
    const obtenerCoordenadas = async (direccionCompleta) => {
      try {
        const response = await geocodingClient
          .forwardGeocode({
            query: direccionCompleta,
            limit: 1,
            language: ["es"],
          })
          .send();

        console.log("Respuesta de geocodificación:", response.body);

        if (
          response &&
          response.body &&
          response.body.features &&
          response.body.features.length > 0
        ) {
          const { center } = response.body.features[0];
          setCoordinates({ latitude: center[1], longitude: center[0] });
        } else {
          console.error(
            "No se encontraron coordenadas para la dirección proporcionada."
          );
        }
      } catch (error) {
        console.error("Error al obtener coordenadas:", error);
      }
    };

    if (direccionCompleta) {
      obtenerCoordenadas(direccionCompleta);
    }
  }, [direccionCompleta]); // Dependencia de direccionCompleta

  // URL de Google Maps
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    direccionCompleta
  )}`;

  if (registro && registro.Tipo == "Cambaceo_Diario") {
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
            <Link to="/cambaceoDiario">
              <ArrowLeft className="ml-4 regreso" />
              <span style={{ marginBottom: "100px" }} id="indicador">
                Menu Cambaceo
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
            <h2 className="titulo-cambaceo px-5 ">Cambaceo Diario</h2>
          </div>

          <div
            className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4"
            id="contenedor-cambaceo"
          >
            <Form>
              <Row className="mb-5">
                <Col xs={12} md={6}>
                  <div>
                    <h5 style={{ textAlign: "left" }}>Empresa</h5>
                    <InputTextarea
                      type="text"
                      placeholder="El campo no es obligatorio"
                      value={TipoEmpresa}
                      disabled
                      className="w-100"
                      rows={1}
                    />
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    <h5 style={{ textAlign: "left" }}>Telefono</h5>
                    <InputTextarea
                      type="text"
                      placeholder="El campo no es obligatorio"
                      value={Telefono}
                      disabled
                      className="w-100"
                      rows={1}
                    />
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    <h5 style={{ textAlign: "left" }}>Dirección</h5>

                    <InputTextarea
                      type="text"
                      placeholder="El campo no es obligatorio"
                      value={direccionCompleta || " "}
                      disabled
                      className="w-100"
                    />
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    <h5 style={{ textAlign: "left" }}>Descripcion</h5>
                    <InputTextarea
                      rows={4}
                      placeholder="El campo no es obligatorio"
                      value={Descripcion}
                      disabled
                      className="w-100"
                    />
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    <Row>
                      <Col md={6}>
                        <h6 style={{ textAlign: "left" }}>Fecha Inicio</h6>
                        <InputTextarea
                          id="fecha-inicio"
                          value={horaInicio}
                          disabled
                          className="w-100"
                          rows={1}
                        />
                      </Col>
                      <Col md={6}>
                        <h6 style={{ textAlign: "left" }}>Horario</h6>
                        <InputTextarea
                          id="horario"
                          value={horario}
                          disabled
                          className="w-100"
                          rows={1}
                        />
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col xs={12} md={6} className="mt-3">
                  <Row
                    className="mb-5"
                    style={{ textAlign: "right", marginTop: "-3.5rem" }}
                  >
                    <Col xs={12} md={12}>
                      <Button
                        variant="danger"
                        rounded="true"
                        style={{ marginBottom: "-2.7rem" }}
                        onClick={() => handleIncidenciaClick(registro)}
                      >
                        Agregar Incidencia
                      </Button>
                    </Col>
                  </Row>
                  <Map
                    viewState={{
                      longitude: coordinates.longitude,
                      latitude: coordinates.latitude,
                      zoom: 16,
                    }}
                    style={{
                      width: "100%",
                      height: "480px",
                      borderRadius: "8px",
                    }}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    onStyleLoad={(map) => {
                      map.setLayoutProperty("country-label", "text-field", [
                        "get",
                        "name_es",
                      ]);
                    }}
                    mapboxAccessToken={mapboxToken}
                  >
                    <Marker
                      longitude={coordinates.longitude}
                      latitude={coordinates.latitude}
                    />
                  </Map>
                  <Row>
                    <div
                      style={{ marginTop: "20px" }}
                      className="d-flex justify-content-end"
                    >
                      <Button className="btn-exportar">
                        <a
                          href={googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "white", textDecoration: "none" }}
                          className="btn "
                        >
                          Abrir en Google Maps
                        </a>
                      </Button>
                    </div>
                  </Row>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    );
  } else if (registro && registro.Tipo == "Cambaceo_Semanal") {
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
            <Link to="/cambaceoSemanal">
              <ArrowLeft className="ml-4 regreso" />
              <span style={{ marginBottom: "100px" }} id="indicador">
                Menu Cambaceo
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
            <h2 className="titulo-cambaceo px-5 ">Cambaceo Semanal</h2>
          </div>

          <div
            className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4"
            id="contenedor-cambaceo"
          >
            <Form>
              <Row className="mb-5">
                <Col xs={12} md={6}>
                  <div>
                    <h5 style={{ textAlign: "left" }}>Empresa</h5>
                    <InputTextarea
                      type="text"
                      placeholder="El campo no es obligatorio"
                      value={TipoEmpresa}
                      disabled
                      className="w-100"
                      rows={1}
                    />
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    <h5 style={{ textAlign: "left" }}>Telefono</h5>
                    <InputTextarea
                      type="text"
                      placeholder="El campo no es obligatorio"
                      value={Telefono}
                      disabled
                      className="w-100"
                      rows={1}
                    />
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    <h5 style={{ textAlign: "left" }}>Dirección</h5>

                    <InputTextarea
                      type="text"
                      placeholder="El campo no es obligatorio"
                      value={direccionCompleta || " "}
                      disabled
                      className="w-100"
                    />
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    <h5 style={{ textAlign: "left" }}>Descripcion</h5>
                    <InputTextarea
                      rows={4}
                      placeholder="El campo no es obligatorio"
                      value={Descripcion}
                      disabled
                      className="w-100"
                    />
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    <Row>
                      <Col md={6}>
                        <h6 style={{ textAlign: "left" }}>Fecha Inicio</h6>
                        <InputTextarea
                          id="fecha-inicio"
                          value={horaInicio}
                          disabled
                          className="w-100"
                          rows={1}
                        />
                      </Col>
                      <Col md={6}>
                        <h6 style={{ textAlign: "left" }}>Horario</h6>
                        <InputTextarea
                          id="horario"
                          value={horario}
                          disabled
                          className="w-100"
                          rows={1}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <h6 style={{ textAlign: "left" }}>Fecha Conlcusion</h6>
                        <InputTextarea
                          id="fecha-conlcusion"
                          value={horaConlcusion}
                          disabled
                          className="w-100"
                          rows={1}
                        />
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col xs={12} md={6} className="mt-3">
                  <Row
                    className="mb-5"
                    style={{ textAlign: "right", marginTop: "-3.5rem" }}
                  >
                    <Col xs={12} md={12}>
                      <Button
                        variant="danger"
                        rounded="true"
                        style={{ marginBottom: "-2.7rem" }}
                        onClick={() => handleIncidenciaClick(registro)}
                      >
                        Agregar Incidencia
                      </Button>
                    </Col>
                  </Row>
                  <Map
                    viewState={{
                      longitude: coordinates.longitude,
                      latitude: coordinates.latitude,
                      zoom: 16,
                    }}
                    style={{
                      width: "100%",
                      height: "480px",
                      borderRadius: "8px",
                    }}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    onStyleLoad={(map) => {
                      map.setLayoutProperty("country-label", "text-field", [
                        "get",
                        "name_es",
                      ]);
                    }}
                    mapboxAccessToken={mapboxToken}
                  >
                    <Marker
                      longitude={coordinates.longitude}
                      latitude={coordinates.latitude}
                    />
                  </Map>
                  <Row>
                    <div
                      style={{ marginTop: "20px" }}
                      className="d-flex justify-content-end"
                    >
                      <Button className="btn-exportar">
                        <a
                          href={googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "white", textDecoration: "none" }}
                          className="btn "
                        >
                          Abrir en Google Maps
                        </a>
                      </Button>
                    </div>
                  </Row>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    );
  } else {
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
            <Link to="/visitaProgramada">
              <ArrowLeft className="ml-4 regreso" />
              <span style={{ marginBottom: "100px" }} id="indicador">
                Menu Visita
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
              Visita Programada {horaInicio}
            </h2>
          </div>

          <div
            className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4"
            id="contenedor-cambaceo"
          >
            <Form>
              <Row className="mb-5">
                <Col xs={12} md={6}>
                  <div>
                    <h5 style={{ textAlign: "left" }}>Empresa</h5>
                    <InputTextarea
                      type="text"
                      placeholder="El campo no es obligatorio"
                      value={TipoEmpresa}
                      disabled
                      className="w-100"
                      rows={1}
                    />
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    <h5 style={{ textAlign: "left" }}>Telefono</h5>
                    <InputTextarea
                      type="text"
                      placeholder="El campo no es obligatorio"
                      value={Telefono}
                      disabled
                      className="w-100"
                      rows={1}
                    />
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    <h5 style={{ textAlign: "left" }}>Dirección</h5>

                    <InputTextarea
                      type="text"
                      placeholder="El campo no es obligatorio"
                      value={direccionCompleta || " "}
                      disabled
                      className="w-100"
                    />
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    <h5 style={{ textAlign: "left" }}>Descripcion</h5>
                    <InputTextarea
                      rows={4}
                      placeholder="El campo no es obligatorio"
                      value={Descripcion}
                      disabled
                      className="w-100"
                    />
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    <Row>
                      <Col md={6}>
                        <h6 style={{ textAlign: "left" }}>Fecha Inicio</h6>
                        <InputTextarea
                          id="fecha-inicio"
                          value={horaInicio}
                          disabled
                          className="w-100"
                          rows={1}
                        />
                      </Col>
                      <Col md={6}>
                        <h6 style={{ textAlign: "left" }}>Horario</h6>
                        <InputTextarea
                          id="horario"
                          value={horario}
                          disabled
                          className="w-100"
                          rows={1}
                        />
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col xs={12} md={6} className="mt-3">
                  <Row
                    className="mb-5"
                    style={{ textAlign: "right", marginTop: "-3.5rem" }}
                  >
                    <Col xs={12} md={12}>
                      <Button
                        variant="danger"
                        rounded="true"
                        style={{ marginBottom: "-2.7rem" }}
                        onClick={() => handleIncidenciaClick(registro)}
                      >
                        Agregar Incidencia
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Map
                      viewState={{
                        longitude: coordinates.longitude,
                        latitude: coordinates.latitude,
                        zoom: 16,
                      }}
                      style={{
                        width: "100%",
                        height: "480px",
                        borderRadius: "8px",
                      }}
                      mapStyle="mapbox://styles/mapbox/streets-v11"
                      onStyleLoad={(map) => {
                        map.setLayoutProperty("country-label", "text-field", [
                          "get",
                          "name_es",
                        ]);
                      }}
                      mapboxAccessToken={mapboxToken}
                    >
                      <Marker
                        longitude={coordinates.longitude}
                        latitude={coordinates.latitude}
                      />
                    </Map>
                    <div
                      style={{ marginTop: "20px" }}
                      className="d-flex justify-content-end"
                    >
                      <Button className="btn-exportar">
                        <a
                          href={googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "white", textDecoration: "none" }}
                          className="btn "
                        >
                          Abrir en Google Maps
                        </a>
                      </Button>
                    </div>
                  </Row>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
export default Colab_PruebaMaps;
