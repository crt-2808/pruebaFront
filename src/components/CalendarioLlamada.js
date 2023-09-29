import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import Navbar from "./navbar";
import { ArrowLeft } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function CalendarioLlamada() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const formData= new FormData
  const onSubmit = async (data) => {
    data={...data, Tipo:"Llamada", FechaConclusion:"2024-12-04", Documentos:"src", IDColaborador:1, Direccion_Calle:"prueba"}
    formData.append("Tipo", data.Tipo)
    formData.append("FechaAsignacion", data.FechaAsignacion)
    formData.append("FechaConclusion", data.FechaConclusion)
    formData.append("Descripcion", data.Descripcion)
    formData.append("Documentos", data.Documentos)
    formData.append("NombreCompleto", data.NombreCompleto)
    formData.append("Telefono", data.Telefono)
    formData.append("IDColaborador", data.IDColaborador)
    formData.append("Direccion_Calle", data.Direccion_Calle)
    console.log(data)
    console.log("formdata", formData)

    try {
      let config = {
        method: "POST",
        mode: "cors",
        body: formData,
      };
      let res = await fetch("https://sarym-production-4033.up.railway.app/api/llamada", config);
      let json = await res.json();
      console.log(json);

        Swal.fire({
          icon: 'success',
          title: 'Se agregó la llamada exitosamente',
          text: 'UDA',
          timer: 1200,
          timerProgressBar: true,
          backdrop: `
            rgba(36,32,32,0.65)
          `,
        }).then(() => {
          // Redirect or perform any other actions after success
          navigate('/Llamada');
        });
      }catch(error){
        // Handle error case
        console.error('Failed to submit data for llamada.');
        Swal.fire({
          icon: 'error',
          title: 'Se produjo un error',
          text: 'UDA',
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
          style={{marginBottom:"0px"}}
        >
          <Form
            onSubmit={handleSubmit(onSubmit)}
            // encType="multipart/form-data"
            method="post"
            id="form"
          >
            <Row className="mb-5">
            <Col xs={12} md={6}>
                <Form.Group>
                    <Form.Label for="NombreCompleto">Nombre Completo</Form.Label>
                        <Form.Control type="text" 
                        placeholder="Ingresa el nombre de contacto" 
                        {...register("NombreCompleto", { required: true })}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label for="Telefono">Telefono</Form.Label>
                        <Form.Control type="text" 
                        placeholder="Ingresa el telefono de contacto" 
                        {...register("Telefono", { required: true })}/>
                </Form.Group>
                <Form.Group>
              <Form.Label for="FechaAsignacion">Fecha</Form.Label>
              <Form.Control
                type="date"
                {...register("FechaAsignacion", { required: true })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label for="Hora">Hora Inicio</Form.Label>
              <Form.Control
                type="time"
                {...register("Hora", { required: true })}
              />
            </Form.Group>
          
            </Col>
            <Col xs={12} md={6}>    
                <Form.Group>
                      <Form.Label for="Descripcion" style={{ textAlign: "left" }}>Descripcion</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Descripcion de la actividad diaria"
                        {...register("Descripcion", { required: true })}
                        type="text"
                      />
                    </Form.Group>
                    <Form.Group
                      style={{ marginTop: "15px" }}
                      controlId="DocumentosReal"
                    >
                      <h6 style={{ textAlign: "left" }}>Documentos</h6>
                      <Form.Control type="file" multiple 
                      {...register("DocumentosReal", { required: false })}/>
                    </Form.Group>

                <Button type="submit" value="Enviar" variant="success" size="lg"
                style={{ marginTop: '25px' }}
                onClick={ onSubmit}
                >
                  Confirmar</Button>
                  
            </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
}
export default CalendarioLlamada;

