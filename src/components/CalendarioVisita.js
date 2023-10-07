import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import Navbar from "./navbar";
import { ArrowLeft } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function CalendarioVisita() {
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
        navigate("/VisitaProgramada");
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
          <Link to="https://sarym-production-4033.up.railway.app/api/VisitaProgramada">
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
          <h2 className="titulo-cambaceo px-5 ">Agregar Visita</h2>
        </div>

        <div
          className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4"
          id="contenedor-cambaceo"
          style={{ marginBottom: "0px" }}
        >
          <form action="http://localhost:3005/guardar_datos_visita" method="POST">
            <Row>
              <Col>
                <label for="NombreCompleto">Nombre Completo:</label>
                <input
                  type="text"
                  id="NombreCompleto"
                  name="NombreCompleto"
                  required
                />
                <br />

                <label for="telefono">Teléfono:</label>
                <input type="text" id="telefono" name="telefono" required />
                <br />

                <label for="fecha">Fecha:</label>
                <input
                  type="datetime-local"
                  id="FechaAsignacion"
                  name="FechaAsignacion"
                  required
                />
                <br />

                <label for="Direccion_Calle">Calle:</label>
                <input
                  type="text"
                  id="Direccion_Calle"
                  name="Direccion_Calle"
                  required
                />
                <br />

                <label for="Direccion_Num_Ext">Numero Exterior:</label>
                <input
                  type="text"
                  id="Direccion_Num_Ext"
                  name="Direccion_Num_Ext"
                  required
                />
                <br />
              </Col>
              <Col>
                <label for="Direccion_Num_Int">Numero Interior:</label>
                <input
                  type="text"
                  id="Direccion_Num_Int"
                  name="Direccion_Num_Int"
                  required
                />
                <br />

                <label for="Direccion_CP">Codigo Postal:</label>
                <input
                  type="text"
                  id="Direccion_CP"
                  name="Direccion_CP"
                  required
                />
                <br />

                <label for="Direccion_Colonia">Colonia:</label>
                <input
                  type="text"
                  id="Direccion_Colonia"
                  name="Direccion_Colonia"
                  required
                />
                <br />

                <label for="TipoEmpresa">Empresa:</label>
                <input
                  type="text"
                  id="TipoEmpresa"
                  name="TipoEmpresa"
                  required
                />
                <br />

                <label for="Sitioweb">Sitio Web:</label>
                <input type="text" id="Sitioweb" name="Sitioweb" required />
                <br />

                <label for="descripcion">Descripción:</label>
                <textarea
                  id="Descripcion"
                  name="Descripcion"
                  required
                  type="text"
                ></textarea>
              </Col>
              <Button
                type="submit"
                value="Enviar"
                variant="success"
                size="lg"
                style={{ marginTop: "25px" }}
              >
                Confirmar
              </Button>
            </Row>
          </form>
        </div>
      </div>
    </div>
  );
}
export default CalendarioVisita;
