import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import Navbar from "./navbar";
import { ArrowLeft } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function CambaceoSemanal() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleCancel = () => {
    // Lógica para cancelar el formulario
  };
  const navigate = useNavigate();
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
        mode: "cors",
      };
      //let res = await fetch("http://localhost:3001/api/colaborador", config);
      //let json = await res.json();
      //console.log(json);
      Swal.fire({
        icon: "success",
        title: "Se agregó tu colaborador exitosamente",
        text: "UDA",
        timer: 1200,
        timerProgressBar: true,
        backdrop: `
        rgba(36,32,32,0.65)
        
      `,
      }).then(() => {
        navigate("/Cambaceo");
      });
    } catch (error) {
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
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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
                        {...register("contactos", { required: true })}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label for="telefono">Telefono</Form.Label>
                        <Form.Control type="text" 
                        placeholder="Ingresa el telefono de contacto" 
                        {...register("tel", { required: true })}/>
                </Form.Group>
                <Form.Group>
              <Form.Label for="dateInput">Fecha Inicio</Form.Label>
              <Form.Control
                type="date"
                {...register("Date", { required: true })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label for="dateInput">Fecha Fin</Form.Label>
              <Form.Control
                type="date"
                {...register("Date", { required: true })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label for="timeInput">Hora Inicio</Form.Label>
              <Form.Control
                type="time"
                {...register("Time", { required: true })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label for="timeInput">Hora Fin</Form.Label>
              <Form.Control
                type="time"
                {...register("Time", { required: true })}
              />
            </Form.Group>
            <Form.Group>
                    <Form.Label for="NombreCompleto">Calle</Form.Label>
                        <Form.Control type="text" 
                        placeholder="Ingresa la calle de la cita" 
                        {...register("contactos", { required: true })}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label for="NombreCompleto">Numero Exterior</Form.Label>
                        <Form.Control type="text" 
                        placeholder="Ingresa el numero exterior" 
                        {...register("contactos", { required: true })}/>
                </Form.Group>
            </Col>
            <Col xs={12} md={6}>
                <Form.Group>
                    <Form.Label for="NombreCompleto">Numero Interior</Form.Label>
                        <Form.Control type="text" 
                        placeholder="Ingresa el numero interior" 
                        {...register("contactos", { required: true })}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label for="NombreCompleto">Codigo Postal</Form.Label>
                        <Form.Control type="text" 
                        placeholder="Ingresa el codigo postal" 
                        {...register("contactos", { required: true })}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label for="NombreCompleto">Colonia</Form.Label>
                        <Form.Control type="text" 
                        placeholder="Ingresa la colonia" 
                        {...register("contactos", { required: true })}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label for="NombreCompleto">Tipo de Empresa</Form.Label>
                        <Form.Control type="text" 
                        placeholder="Ingresa el tipo de empresa" 
                        {...register("contactos", { required: true })}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label for="NombreCompleto">Sitio Web</Form.Label>
                        <Form.Control type="text" 
                        placeholder="Ingresa el dominio de la empresa" 
                        {...register("contactos", { required: true })}/>
                </Form.Group>
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
                <Button type="submit" value="Enviar" variant="success" size="lg"
                style={{ marginTop: '25px' }}>
                  Confirmar</Button>
            </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
}
export default CambaceoSemanal;
