import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "./navbar";
import { ArrowLeft } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Form } from "react-bootstrap";

function CalendarioLlamada() {
  const navigate = useNavigate();
  const [NombreCompleto, setNombreCompleto] = useState("");
  const [Telefono, setTelefono] = useState("");
  const [FechaAsignacion, setFecha] = useState(null);
  const [Descripcion, setDescripcion] = useState("");
  const [DocumentosReal, setDocumentos] = useState([]);

  const handleSubmit = () => {
    // Aquí puedes enviar los datos a la base de datos MySQL utilizando Axios u otra biblioteca de HTTP.
    // Por ejemplo, puedes enviarlos a una API REST.

    const data = {
      NombreCompleto,
      Telefono,
      FechaAsignacion,
      Descripcion,
    };
    axios
      //.post("http://localhost:3005/guardar_datos", data)
      .post("https://sarym-production-4033.up.railway.app/api/llamada", data)
      .then((response) => {
        // Muestra una alerta de éxito
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Los datos se han registrado correctamente",
          timer: 1200,
          timerProgressBar: true,
          backdrop: `
        rgba(36,32,32,0.65)
        
      `,
        }).then(() => {
          navigate("/Llamada");
        });
      })
      .catch((error) => {
        // Muestra una alerta de error
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al registrar los datos",
          timer: 1200,
          timerProgressBar: true,
          backdrop: `
        rgba(36,32,32,0.65)
        
      `,
        });
        console.error("Error al enviar los datos al servidor:", error);
      });
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
          <Link to="/Llamada">
            <ArrowLeft className="ml-4 regreso" />
            <span style={{ marginBottom: "100px" }} id="indicador">
              Menu Llamada
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
          <h2 className="titulo-cambaceo px-5 ">Agregar Llamada</h2>
        </div>

        <div
          className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4"
          id="contenedor-cambaceo"
          style={{ marginBottom: "0px" }}
        >
          <Row className="mb-5">
            <Col xs={12} md={6}>
              <div className="p-field">
                <label htmlFor="NombreCompleto">
                  Nombre Completo
                  <br />
                </label>
              </div>
              <div>
                <InputText
                  id="NombreCompleto"
                  value={NombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="p-field">
                <label htmlFor="Telefono">Teléfono</label>
              </div>
              <div>
                <InputText
                  id="Telefono"
                  value={Telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="p-field">
                <label htmlFor="FechaAsignacion">Fecha y Hora</label>
              </div>
              <div>
                <Calendar
                  id="FechaAsignacion"
                  value={FechaAsignacion}
                  onChange={(e) => setFecha(e.value)}
                  showIcon
                  showTime
                  hourFormat="12"
                  dateFormat="mm/dd/yy"
                  style={{ width: "100%" }}
                />
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="p-field">
                <label htmlFor="Descripcion">Descripción</label>
              </div>
              <div>
                <InputTextarea
                  id="Descripcion"
                  autoResize
                  value={Descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={5}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="p-field">
                <label>Documentos</label>
                <FileUpload
                  name="DocumentosReal"
                  url="https://your-server.com/upload"
                  mode="advanced"
                  accept="image/*,application/pdf"
                  onSelect={(e) => setDocumentos(e.files)}
                  multiple
                  auto
                  disabled
                  style={{ width: "100%" }}
                />
              </div>
            </Col>
            <Button
              label="Confirmar"
              onClick={handleSubmit}
              severity="success"
              style={{ width: "100%" }}
            />
          </Row>
        </div>
      </div>
    </div>
  );
}
export default CalendarioLlamada;
