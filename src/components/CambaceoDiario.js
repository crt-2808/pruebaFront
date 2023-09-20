import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";
import { Form, Button, Row, Col } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import Navbar from "./navbar";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Calendar } from "primereact/calendar";
import "../theme.css";
import "primereact/resources/primereact.css"; // core css
import { addLocale } from "primereact/api";
// import { Button } from 'primereact/button';

// import Autocomplete from "react-google-autocomplete";
const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 23.3557,
  lng: -99.1845,
};
function CambaceoDiario() {
  const navigate = useNavigate();
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoPosition, setInfoPosition] = useState(null);
  const [infoContent, setInfoContent] = useState(null);
  const [fechaInicio, setfechaInicio] = useState(null);
  const [fechaFin, setfechaFin] = useState(null);
  const [horaInicio, sethoraInicio] = useState(null);
  const [horaFin, sethoraFin] = useState(null);
  const { register, handleSubmit } = useForm();

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
    try {
      console.log(data);
      console.log("Inicio: " + fechaInicio);
      const FechaAsignacion = formateoFecha(fechaInicio);
      const FechaConclucion = formateoFecha(fechaFin);
      console.log(
        "Fecha inicio: " + FechaAsignacion + " Fecha fin: " + FechaConclucion
      );
      let inputElem = document.getElementById("documentoCambaceo");
      let file = inputElem.files[0];
      let blob = file.slice(0);
      const imagen = new File([blob], `${file.name}`);
      const formData = new FormData();
      // const geocoder = new window.google.maps.Geocoder();
      // geocoder.geocode({ address: data.address }, (results, status) => {
      //   if (status === "OK") {
      //     setMarkerPosition(results[0].geometry.location);
      //   } else {
      //     console.error("Error en la búsqueda de dirección");
      //   }
      // });
      data = {
        ...data,
        FechaAsignacion: FechaAsignacion,
        FechaConclucion: FechaConclucion,
        documentoCambaceo: imagen,
      };
      console.log(data);
      formData.append("Direccion", data.direccion);
      formData.append("Descripcion", data.Descripcion);
      formData.append("FechaAsignacion", data.FechaAsignacion);
      formData.append("FechaConclucion", data.FechaConclucion);
      formData.append("documentoCambaceo", imagen);
      for (let pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }
    } catch (error) {
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
  };

  const formStyle = {
    backgroundColor: "#fffff",
    padding: "30px",
    borderRadius: "10px",
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
  const daily = () => {
    console.log("Aqui");
  };
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
      <LoadScript
        googleMapsApiKey="AIzaSyCYTnjfbc1xKJkFQxnEXtx1yLVgKu2K3IY"
        libraries={["places"]}
      >
        <div className="py-md-4" style={{ backgroundColor: "#F1F5F8" }}>
          <div
            className="row"
            style={{ marginLeft: "35px", marginBottom: "-50px", marginRight:"0px"}}
          >
            <h2 className="titulo-cambaceo px-5 " >Cambaceo Diario</h2>
          </div>

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
                        rows={4}
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
                            touchUI
                            placeholder="Ingresa la fecha"
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
                          <h6 style={{ textAlign: "left" }}>Horario</h6>
                          <div className="row">
                            <div className="col-md-6">
                              <Calendar
                                id="calendar-24h-fin"
                                value={horaInicio}
                                className="custom-calendar"
                                onChange={(e) => {
                                  sethoraInicio(e.value);
                                  const horaFinNueva = new Date(
                                    e.value.getTime() + 60000
                                  );
                                  sethoraFin(horaFinNueva);
                                }}
                                timeOnly
                                hourFormat="24"
                                dateFormat="dd/mm/yy"
                                locale="es"
                                placeholder="Hora Inicio"
                                showIcon
                              />
                            </div>
                            <div className="col-md-6">
                              <Calendar
                                id="calendar-24h-fin"
                                value={horaFin}
                                className="custom-calendar"
                                onChange={(e) => sethoraFin(e.value)}
                                timeOnly
                                hourFormat="24"
                                dateFormat="dd/mm/yy"
                                locale="es"
                                showIcon
                                placeholder="Hora Fin"
                                minDate={
                                  horaInicio
                                    ? new Date(horaInicio.getTime() + 60000)
                                    : null
                                }
                              />
                            </div>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    <Form.Group
                      style={{ marginTop: "15px" }}
                      controlId="documentoCambaceo"
                    >
                      <h5 style={{ textAlign: "left" }}>Documentos</h5>
                      <Form.Control type="file" multiple />
                    </Form.Group>
                  </div>
                </Col>
                <Col xs={12} md={6}>
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
        </div>
      </LoadScript>
    </div>
  );
}
export default CambaceoDiario;
