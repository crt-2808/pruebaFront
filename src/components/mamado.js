import React, { useState } from "react";
import Navbar from "./navbar";
import { Link } from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import { Calendar } from "primereact/calendar";
import "../theme.css";
import "primereact/resources/primereact.css"; // core css
import { addLocale } from "primereact/api";
import { Row, Col, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
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

const Codigo2 = ({ FechaProgramada, setFechaProgramada, handleContinuar }) => {
  return (
    <div className="fluid">
      <Navbar></Navbar>
      <Link to="/VisitaProgramada">
        <ArrowLeft className="ml-4 regreso" />
        <span id="indicador">Visita</span>
      </Link>

      <div className="col-12  todo" style={{ height: "90vh" }}>
        <div
          className="container mt-sm-5 mt-md-2 mb-4 p-5"
          id="contenedor-land"
        >
          <div className="row">
            <div className="col-12 text-left">
              <h2 className="tituloPlaneador">Visita</h2>
            </div>
          </div>
          <div className="row pt-md-3  pb-md-4 mb-md-3">
            <div className="col-md-12">
              <div className="row no-padding">
                <div className="col-12">
                  <div className="row no-padding pt-5 pl-0 pr-0">
                    <h3>
                      Ingresa la fecha que <br></br> deseas programar
                    </h3>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row no-padding justify-content-center pt-5 pl-0 pr-0">
                    <div className="col-md-5 col-sm-12">
                      <Calendar
                        value={FechaProgramada}
                        onChange={(e) => {
                          setFechaProgramada(e.value);
                        }}
                        locale="es"
                        className="custom-calendar"
                        showIcon
                        touchUI
                        placeholder="Ingresa la fecha programada"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-12 justify-content-end d-flex">
              <div className="col-md-4">
                <Link to="/VisitaProgramada">
                  <button className="btn-regreso">Cancelar</button>
                </Link>
                <button
                  className="btn-exportar"
                  id="Buscar"
                  onClick={handleContinuar}
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const Codigo1 = ({ fechaProgramada, handleRegresar }) => {
  const {
    register,

    formState: { errors },
  } = useForm();
  console.log(fechaProgramada);
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
          <Link onClick={handleRegresar}>
            <ArrowLeft className="ml-4 regreso" />
            <span id="indicador">Cambia la fecha</span>
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
          <h2 className="titulo-cambaceo px-5 ">Agregar una Visita</h2>
        </div>

        <div
          className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4"
          id="contenedor-cambaceo"
          style={{ marginBottom: "0px" }}
        >
          <Form
            // encType="multipart/form-data"
            method="post"
            id="form"
          >
            <Row className="mb-5">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label htmlFor="NombreCompleto">
                    Nombre Completo
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa el nombre de contacto"
                    {...register("contactos", { required: true })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="telefono">Telefono</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa el telefono de contacto"
                    {...register("tel", { required: true })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="timeInput">Hora Inicio</Form.Label>
                  <Form.Control
                    type="time"
                    {...register("Time", { required: true })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="timeInput">Hora Fin</Form.Label>
                  <Form.Control
                    type="time"
                    {...register("Time", { required: true })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="NombreCompleto">Calle</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa la calle de la cita"
                    {...register("contactos", { required: true })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="NombreCompleto">
                    Numero Exterior
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa el numero exterior"
                    {...register("contactos", { required: true })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="NombreCompleto">
                    Numero Interior
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa el numero interior"
                    {...register("contactos", { required: true })}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label htmlFor="NombreCompleto">
                    Codigo Postal
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa el codigo postal"
                    {...register("contactos", { required: true })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="NombreCompleto">Colonia</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa la colonia"
                    {...register("contactos", { required: true })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="NombreCompleto">
                    Tipo de Empresa
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa el tipo de empresa"
                    {...register("contactos", { required: true })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="NombreCompleto">Sitio Web</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa el dominio de la empresa"
                    {...register("contactos", { required: true })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="NombreCompleto">Sitio Web</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa el dominio de la empresa"
                    {...register("contactos", { required: true })}
                  />
                </Form.Group>
                <Form.Group>
                  <h5 style={{ textAlign: "left" }}>Descripcion</h5>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Descripcion de la actividad diaria"
                    {...register("Descripcion", { required: true })}
                  />
                </Form.Group>
                <Button
                  type="submit"
                  value="Enviar"
                  variant="success"
                  size="lg"
                  style={{ marginTop: "25px" }}
                >
                  Confirmar
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};

const Mamado = () => {
  const [mostrarCodigo2, setMostrarCodigo2] = useState(false);
  const [fechaProgramada, setFechaProgramada] = useState(null);

  const handleContinuar = () => {
    if (fechaProgramada !== null) {
      const fechaFormateada = formateoFecha(fechaProgramada);
      setMostrarCodigo2(true);
      setFechaProgramada(fechaFormateada);
    }
    if (fechaProgramada === null) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes ingresar una fecha",
      });
    }
  };
  const handleRegresar = () => {
    setMostrarCodigo2(false);
    setFechaProgramada(null);
  };

  if (mostrarCodigo2) {
    return (
      <Codigo1
        fechaProgramada={fechaProgramada}
        handleRegresar={handleRegresar}
      />
    );
  } else {
    return (
      <Codigo2
        fechaProgramada={fechaProgramada}
        setFechaProgramada={setFechaProgramada}
        handleContinuar={handleContinuar}
      />
    );
  }
};

export default Mamado;
