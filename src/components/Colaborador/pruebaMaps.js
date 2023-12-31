import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Form, Button, Row, Col } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import { InputTextarea } from "primereact/inputtextarea";
import Navbar from "../navbar";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../../theme.css";
import "primereact/resources/primereact.css"; // core css
import { addLocale } from "primereact/api";
// import { Button } from 'primereact/button';

// import Autocomplete from "react-google-autocomplete";
const containerStyle = {
  width: "100%",
  height: "480px",
};
const libraries = ["places"];

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
function Colab_PruebaMaps() {
  const [map, setMap] = useState(null);
  const location=useLocation();
  const registro =location.state;
  const [direccion, setDireccion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [tipoEmpresa, settipoEmpresa] = useState("");
  const [telefono, setTelefono] = useState("");
  const [horaInicio, sethoraInicio] = useState(null);
  const [horaFin, sethoraFin] = useState(null);
  const [fecha, setFecha] = useState(null);
  const [direccionCompleta, setDireccionCompleta] = useState("");
  const [direccionCoords, setDireccionCoords] = useState(null);
  const [center, setCenter] = useState({
    lat: 23.3557,
    lng: -99.1845,
  });
  console.log(registro)
  const onLoad = (map) => {
    setMap(map);
  };

  const onUnmount = () => {
    setMap(null);
  };

  const formatearFecha = (fecha) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Intl.DateTimeFormat("es-ES", options).format(new Date(fecha));
  };
  const geocodeDireccion = async () => {
    try {
      console.log(direccionCompleta);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          direccionCompleta
        )}&key=AIzaSyCYTnjfbc1xKJkFQxnEXtx1yLVgKu2K3IY`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setDireccionCoords(location);

        setCenter(location);
      }
    } catch (error) {
      console.error("Error al geocodificar la dirección:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = {
          id: "83",
          fecha: "2023-11-23 00:00:00",
        };
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

        let res = await fetch(
          "https://sarym-production-4033.up.railway.app/api/cambaceo/seguimientoDiario",
          config
        );
        Swal.close();
        let json = await res.json();
        console.log(json);
        if (json && json.length > 0) {
          const item = json[0];
          setNombreCompleto(item.NombreCompleto || "");
          setTelefono(item.Telefono || "");
          setDireccion(item.Direccion_Calle || "");
          setDescripcion(item.Descripcion || "");
          settipoEmpresa(item.TipoEmpresa || "")
          const fechaAsignacion = new Date(item.FechaAsignacion);
          // Establecer la fecha común
          setFecha(new Date(fechaAsignacion.setHours(0, 0, 0, 0)));

          const fechaInicio = convierteFecha(item.FechaAsignacion);
          const fechaFin = convierteFecha(item.FechaConclusion);

          // Aquí, separa la fecha y la hora para los estados correspondientes
          const [fecha, horaInicio] = fechaInicio.split(" ");
          const [_, horaFin] = fechaFin.split(" ");
          sethoraInicio(horaInicio);
          sethoraFin(horaFin);
          // sethoraInicio(new Date(`1970-01-01 ${horaInicio}`));
          // sethoraFin(new Date(`1970-01-01 ${horaFin}`));
          // Construir la dirección completa
          const direccion = `${item.Direccion_Calle || ""} ${
            item.Direccion_Num_Ext || ""
          } ${item.Direccion_Num_Int || ""}, ${
            item.Direccion_Colonia || ""
          }, CP: ${item.Direccion_CP || ""}`;
          setDireccionCompleta(direccion);
          geocodeDireccion();
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (direccionCompleta) {
      geocodeDireccion();
    }
  }, [direccionCompleta]); // Dependencia de direccionCompleta
  // URL de Google Maps
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    direccionCompleta
  )}`;
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
          <Link to="/Colaborador/Cambaceo_Diario">
            <ArrowLeft className="ml-4 regreso" />
            <span style={{ marginBottom: "100px" }} id="indicador">
              Menu Cambaceo
            </span>
          </Link>
        </div>
      </div>
      <LoadScript
        googleMapsApiKey="AIzaSyCYTnjfbc1xKJkFQxnEXtx1yLVgKu2K3IY"
        libraries={libraries}
      >
        <div className="py-md-4" style={{ backgroundColor: "#F1F5F8" }}>
          <div
            className="row"
            style={{
              marginLeft: "35px",
              marginBottom: "-50px",
              marginRight: "0px",
            }}
          >
            <h2 className="titulo-cambaceo px-5 ">Cambaceo</h2>
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
                      placeholder="Ingresa tu nombre completo"
                      value={tipoEmpresa}
                      disabled
                      className="w-100"
                      rows={1}
                    />
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    <h5 style={{ textAlign: "left" }}>Telefono</h5>
                    <InputTextarea
                      type="text"
                      placeholder="Ingresa tu telefono"
                      value={telefono}
                      disabled
                      className="w-100"
                      rows={1}
                    />
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    <h5 style={{ textAlign: "left" }}>Dirección</h5>

                    <InputTextarea
                      type="text"
                      placeholder="Ingresa tu dirección"
                      value={direccionCompleta}
                      disabled
                      className="w-100"
                    />
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    <h5 style={{ textAlign: "left" }}>Descripcion</h5>
                    <InputTextarea
                      rows={4}
                      placeholder="Descripcion de la actividad diaria"
                      value={descripcion}
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
                          value={formatearFecha(fecha)}
                          disabled
                          className="w-100"
                          rows={1}
                        />
                      </Col>
                      <Col md={6}>
                        <h6 style={{ textAlign: "left" }}>Horario</h6>
                        <InputTextarea
                          id="horario"
                          value={`${horaInicio || ""} - ${horaFin || ""}`}
                          disabled
                          className="w-100"
                          rows={1}
                        />
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col xs={12} md={6} className="mt-3">
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={direccionCoords || center}
                    zoom={16}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                  >
                    {direccionCoords && <Marker position={direccionCoords} />}
                  </GoogleMap>
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
      </LoadScript>
    </div>
  );
}
export default Colab_PruebaMaps;
