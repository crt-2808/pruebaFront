import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import Navbar from "./navbar";
import { ArrowLeft } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { Calendar } from "primereact/calendar";
import Swal from "sweetalert2";

function CalendarioLlamada() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const formData = new FormData();
  const onSubmit = async (data) => {
    console.log("data del formulario", data);
    data = {
      ...data,
    };

    formData.append("FechaAsignacion", data.FechaAsignacion);
    formData.append("Descripcion", data.Descripcion);
    formData.append("Documentos", data.Documentos);
    formData.append("NombreCompleto", data.NombreCompleto);
    formData.append("Telefono", data.Telefono);

    try {
      // let config = {
      //   method: "POST",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //   },
      //   mode: "cors",
      //   body: JSON.stringify(datos),
      // };
      let config = {
        method: "POST",
        body: formData,
      };

      let res = await fetch("http://localhost:3005/guardar_datos", config);
      let json = await res.json();
      console.log(json);

      Swal.fire({
        icon: "success",
        title: "Se agregó la llamada exitosamente",
        text: "UDA",
        timer: 1200,
        timerProgressBar: true,
        backdrop: `
            rgba(36,32,32,0.65)
          `,
      }).then(() => {
        // Redirect or perform any other actions after success
        // navigate('/Llamada');
      });
    } catch (error) {
      // Handle error case
      console.error("Failed to submit data for llamada.");
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
          <form action="http://localhost:3005/guardar_datos" method="POST">
            <Row>
              <Col>
                <label for="NombreCompleto">Nombre Completo:</label>
                <input
                  type="text"
                  id="NombreCompleto"
                  name="NombreCompleto"
                  required
                />
                <label for="telefono">Teléfono:</label>
                <input type="text" id="telefono" name="telefono" required />
                <label for="fecha">Fecha:</label>
                <input
                  type="datetime-local"
                  id="FechaAsignacion"
                  name="FechaAsignacion"
                  required
                />
              </Col>
              <Col>
                <label for="descripcion">Descripción:</label>
                <textarea
                  id="Descripcion"
                  name="Descripcion"
                  required
                  type="text"
                ></textarea>
                <Form.Group
                  style={{ marginTop: "15px" }}
                  controlId="DocumentosReal"
                >
                  <h6 style={{ textAlign: "left" }}>Documentos</h6>
                  <Form.Control
                    type="file"
                    multiple
                    disabled
                    {...register("DocumentosReal", { required: false })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button
              type="submit"
              value="Enviar"
              variant="success"
              size="lg"
              style={{ marginTop: "25px" }}
              onClick={() => onSubmit}
            >
              Confirmar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default CalendarioLlamada;
