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
    data={...data, TipoEmpresa:" ",
    SitioWeb:" ", IDColab:1,  Direccion_Calle:" ", 
    Direccion_Num_Ext:"1", Direccion_Num_Int:"1", Direccion_CP:"1", Direccion_Colonia:" "}
    
    formData.append("NombreCompleto", data.contactos)
    formData.append("Telefono", data.tel)
    formData.append("FechaAsignacion", data.fecha)
    formData.append("Descripcion", data.descripcion)
    formData.append("TipoEmpresa", data.TipoEmpresa)
    formData.append("SitioWeb", data.SitioWeb)
    formData.append("IDColab", data.IdColab)
    formData.append("Direccion_Calle", data.Direccion_Calle)
    formData.append("Direccion_Num_Ext", data.Direccion_Num_Ext)
    formData.append("Direccion_Num_Int", data.Direccion_Num_Int)
    formData.append("Direccion_CP", data.Direccion_CP)
    formData.append("Direccion_Calle", data.Direccion_Colonia)
    console.log(data)
    console.log("formdata", formData)
    try {
      let config = {
        method: "POST",
        mode: "cors",
        body: formData,
      };
      let res = await fetch("http://localhost:3001/api/llamada", config);
      let json = await res.json();
      console.log(json);

        // Reset the form data and close the modal
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
                    <Form.Label for="contactos">Nombre Completo</Form.Label>
                        <Form.Control type="text" 
                        placeholder="Ingresa el nombre de contacto" 
                        {...register("contactos", { required: true })}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label for="tel">Telefono</Form.Label>
                        <Form.Control type="text" 
                        placeholder="Ingresa el telefono de contacto" 
                        {...register("tel", { required: true })}/>
                </Form.Group>
                <Form.Group>
              <Form.Label for="fecha">Fecha</Form.Label>
              <Form.Control
                type="date"
                {...register("fecha", { required: true })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label for="hora">Hora Inicio</Form.Label>
              <Form.Control
                type="time"
                {...register("hora", { required: true })}
              />
            </Form.Group>
          
            </Col>
            <Col xs={12} md={6}>    
                <Form.Group>
                      <h6 style={{ textAlign: "left" }}>Descripcion</h6>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Descripcion de la actividad diaria"
                        {...register("descripcion", { required: true })}
                      />
                    </Form.Group>
                    <Form.Group
                      style={{ marginTop: "15px" }}
                      controlId="documentoCambaceo"
                    >
                      <h6 style={{ textAlign: "left" }}>Documentos</h6>
                      <Form.Control type="file" multiple 
                      {...register("descripcion", { required: false })}/>
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

