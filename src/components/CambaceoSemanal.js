import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  Autocomplete,
} from "@react-google-maps/api";
import { Form, Button, Row, Col } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import Navbar from "./navbar";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Calendar } from "primereact/calendar";
import "../theme.css";
import "primereact/resources/primereact.css"; // core css
import { addLocale } from "primereact/api";
const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 23.3557,
  lng: -99.1845,
};

function CambaceoSemanal() {
  const navigate = useNavigate();
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoPosition, setInfoPosition] = useState(null);
  const [infoContent, setInfoContent] = useState(null);
  const { register, handleSubmit } = useForm();

  const [fechaInicio, setfechaInicio] = useState(null);
  const [fechaFin, setfechaFin] = useState(null);
  const onLoad = (map) => {
    setMap(map);
  };

  const onPlaceChanged = () => {
    if (Autocomplete !== null) {
      const place = Autocomplete.getPlace();
      if (place.geometry) {
        map.panTo(place.geometry.location);
        map.setZoom(15);
        if (marker !== null) {
          marker.setPosition(place.geometry.location);
        } else {
          setMarker(
            new window.google.maps.Marker({
              position: place.geometry.location,
              map: map,
            })
          );
        }
        setInfoContent(`${place.name}`);
        setInfoPosition(place.geometry.location);
        setInfoOpen(true);
      }
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  const onUnmount = () => {
    setMap(null);
  };

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

  const onSubmit = async (data) => {
    if (data == undefined) {
      return Swal.fire({
        icon: "error",
        title: "Se requiere llenar el formulario",
        text: "UDA",
        timer: 1200,
        timerProgressBar: true,
        backdrop: `
        rgba(36,32,32,0.65)
      `,
      });
    }
    console.log(data);
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

  const formStyle = {
    backgroundColor: "#fffff",
    padding: "30px",
    borderRadius: "10px",
  };
  const daily = () => {};
  useEffect(() => {
    daily();
  }, []);

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
          <Link to="/Cambaceo">
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
          style={{ marginLeft: "35px", marginBottom: "-50px", marginRight:"0px" }}
        >
          <h2 className="titulo-cambaceo px-5">Cambaceo Semanal</h2>
        </div>
        <LoadScript
          googleMapsApiKey="AIzaSyCYTnjfbc1xKJkFQxnEXtx1yLVgKu2K3IY"
          libraries={["places"]}
        >
          <div
            className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4"
            id="contenedor-cambaceo"
          >
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row className="mb-5">
                <Col xs={12} md={6}>
                  <div>
                    <Form.Group>
                      <h5 style={{ textAlign: "left" }}>Dirección</h5>
                      <Autocomplete
                        onLoad={(autocomplete) => autocomplete}
                        onPlaceChanged={onPlaceChanged}
                      >
                        <Form.Control
                          type="text"
                          placeholder="Ingresa tu dirección"
                          {...register("direccion", { required: true })}
                        />
                      </Autocomplete>
                    </Form.Group>
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    <Form.Group>
                      <h5 style={{ textAlign: "left" }}>Descripcion</h5>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Descripcion de la actividad diaria"
                        {...register("Descripcion", { required: true })}
                      />
                    </Form.Group>
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    <Row>
                      <Col>
                        <Form.Group>
                          <h6 style={{ textAlign: "left" }}>Fecha Inicio</h6>
                          <Calendar
                            id="calendar-24h-inicio"
                            value={fechaInicio}
                            onChange={(e) => setfechaInicio(e.value)}
                            showTime
                            hourFormat="24"
                            placeholder="Fecha Inicio"
                            locale="es"
                            dateFormat="dd/mm/yy"
                            className="custom-calendar"
                            showIcon
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    <Row>
                      <Col>
                        <Form.Group>
                          <h6 style={{ textAlign: "left" }}>Fecha Fin</h6>
                          <Calendar
                            id="calendar-24h-fin"
                            value={fechaFin}
                            className="custom-calendar"
                            onChange={(e) => setfechaFin(e.value)}
                            showTime
                            hourFormat="24"
                            placeholder="Fecha Fin"
                            dateFormat="dd/mm/yy"
                            locale="es"
                            minDate={
                              fechaInicio
                                ? new Date(fechaInicio.getTime() + 60000)
                                : null
                            }
                            showIcon
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Form.Group style={{ marginTop: "15px" }}>
                      <h5 style={{ textAlign: "left" }}>Documentos</h5>
                      <Form.Control
                        type="file"
                        multiple
                        {...register("Docs")}
                      />
                    </Form.Group>
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div>
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={center}
                      zoom={10}
                      onLoad={onLoad}
                      onUnmount={onUnmount}
                    >
                      {marker && (
                        <InfoWindow
                          position={infoPosition}
                          onCloseClick={() => setInfoOpen(false)}
                          visible={infoOpen}
                        >
                          <p>{infoContent}</p>
                        </InfoWindow>
                      )}
                    </GoogleMap>
                  </div>
                  <Row>
                    <div style={{ marginTop: "20px" }}>
                      <Button
                        type="submit"
                        value="Enviar"
                        style={{ float: "right", borderRadius: "20px" }}
                        variant="outline-danger"
                        size="lg"
                      >
                        Agregar
                      </Button>
                    </div>
                  </Row>
                </Col>
              </Row>
            </Form>
          </div>
        </LoadScript>
        ;
      </div>
    </div>
  );
}
export default CambaceoSemanal;
