import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import Navbar from "./navbar";
import { ArrowLeft } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Función para formatear las fechas
function formatearFechas(
  fechaAsignacionStr,
  fechaConclusionStr,
  fechaSeguimientoStr
) {
  console.log("Fecha: ", fechaSeguimientoStr);
  // Dividir la cadena de fecha en año, mes y día
  const [anoSeguimiento, mesSeguimiento, diaSeguimiento] =
    fechaSeguimientoStr.split("-");

  // Extraer las horas y minutos de fechaAsignacion y fechaConclusion
  const [horaAsignacion, minutoAsignacion] = fechaAsignacionStr.split(":");
  const [horaConclusion, minutoConclusion] = fechaConclusionStr.split(":");

  // Convertir la fecha de seguimiento al objeto Date
  const fechaSeguimientoObj = new Date(
    Date.UTC(
      anoSeguimiento,
      mesSeguimiento - 1,
      diaSeguimiento,
      horaAsignacion,
      minutoAsignacion,
      0
    )
  );
  console.log("Fecha Despues: ", fechaSeguimientoObj);
  // Establecer las horas y minutos en la fecha de seguimiento
  fechaSeguimientoObj.setHours(horaAsignacion, minutoAsignacion, 0);
  const fechaAsignacionStrNuevo =
    fechaSeguimientoObj.getFullYear() +
    "-" +
    (fechaSeguimientoObj.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    fechaSeguimientoObj.getDate().toString().padStart(2, "0") +
    " " +
    fechaSeguimientoObj.getHours().toString().padStart(2, "0") +
    ":" +
    fechaSeguimientoObj.getMinutes().toString().padStart(2, "0") +
    ":" +
    fechaSeguimientoObj.getSeconds().toString().padStart(2, "0");

  fechaSeguimientoObj.setHours(horaConclusion, minutoConclusion, 0);
  const fechaConclusionStrNuevo =
    fechaSeguimientoObj.getFullYear() +
    "-" +
    (fechaSeguimientoObj.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    fechaSeguimientoObj.getDate().toString().padStart(2, "0") +
    " " +
    fechaSeguimientoObj.getHours().toString().padStart(2, "0") +
    ":" +
    fechaSeguimientoObj.getMinutes().toString().padStart(2, "0") +
    ":" +
    fechaSeguimientoObj.getSeconds().toString().padStart(2, "0");

  // Devolver las fechas formateadas
  return {
    FechaAsignacion: fechaAsignacionStrNuevo,
    FechaConclusion: fechaConclusionStrNuevo,
  };
}

function CambaceoDiario() {
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
    console.log(data);
    console.log(Object.keys(data).length);
    data = {
      ...data,
      IDColaborador: "53",
      Activo: 1,
      Tipo: "Cambaceo_Diario",
      Documentos: "src",
      SitioWeb: "src",
      TipoEmpresa: "src",
    };
    data = {
      ...data,
      ...formatearFechas(
        data.FechaAsignacion,
        data.FechaConclusion,
        data.FechaSeguimiento
      ),
    };
    delete data.FechaSeguimiento;
    console.log("Nuevo: \n", data);
    //                  Falta esto            FechasSeguimiento es de la fechaasiganada del cambaceo Daily
    //  Documentos, IDColaborador 'Dinamico', Incidentes, FechaSeguimiento,
    try {
      let config = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(data),
      };
      try {
        let res = await fetch(
          "https://sarym-production-4033.up.railway.app/api/cambaceo",
          config
        );
        let json = await res.json();
        console.log(json);
        if (res.status == 500 || res.status == 400 || res.status == 404) {
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
        console.log(error);
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
      <div style={{ backgroundColor: "#F1F5F8", padding: "1.5rem 0" }}>
        <div className="row px-5">
          <h2 className="titulo-cambaceo px-5 ">Cambaceo Diario</h2>
        </div>

        <div
          className="container-fluid mt-md-2 mb-md-5 p-md-5 p-3 mb-4 mt-4"
          id="contenedor-cambaceo"
          style={{ marginBottom: "0px" }}
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
                  <Form.Label htmlFor="NombreCompleto">
                    Nombre Completo
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa el nombre de contacto"
                    {...register("NombreCompleto", { required: true })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="telefono">Telefono</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa el telefono de contacto"
                    {...register("Telefono", { required: true })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="dateInput">Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    {...register("FechaSeguimiento", { required: true })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="timeInput">Hora Inicio</Form.Label>
                  <Form.Control
                    type="time"
                    {...register("FechaAsignacion", { required: true })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="timeInput">Hora Fin</Form.Label>
                  <Form.Control
                    type="time"
                    {...register("FechaConclusion", { required: true })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="Calle">Calle</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa la calle de la cita"
                    {...register("Direccion_Calle", { required: true })}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
              <Form.Group>
                  <Form.Label htmlFor="Exterior">Numero Exterior</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa el numero exterior"
                    {...register("Direccion_Num_Ext", { required: true })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="NombreCompleto">
                    Numero Interior
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa el numero interior"
                    {...register("Direccion_Num_Int", { required: true })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="NombreCompleto">
                    Codigo Postal
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa el codigo postal"
                    {...register("Direccion_CP", { required: true })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="NombreCompleto">Colonia</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa la colonia"
                    {...register("Direccion_Colonia", { required: true })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label
                    htmlFor="Descripcion"
                    style={{ textAlign: "left" }}
                  >
                    Descripcion
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Descripcion de la actividad diaria"
                    {...register("Descripcion", { required: true })}
                    type="text"
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
}
export default CambaceoDiario;
