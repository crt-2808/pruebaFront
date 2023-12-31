import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "./navbar";
import { ArrowLeft } from "react-bootstrap-icons";
import { InputMask } from "primereact/inputmask";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Form } from "react-bootstrap";
import { useAuthRedirect } from "../useAuthRedirect";
import { useUserContext } from "../userProvider";

function CalendarioLlamada() {
  useAuthRedirect();
  const { usuario } = useUserContext();
  const email = usuario.email;
  const navigate = useNavigate();
  const [Telefono, setTelefono] = useState("");
  const [FechaAsignacion, setFecha] = useState(null);
  const [Descripcion, setDescripcion] = useState("");
  const [DocumentosReal, setDocumentos] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [nombreColaboradorSeleccionado, setNombreColaboradorSeleccionado] =
    useState("");
  const [idColaboradorSeleccionado, setIdColaboradorSeleccionado] =
    useState("");

  // Función para cargar los nombres de los colaboradores
  const cargarColaboradores = async () => {
    try {
      const requestBody = {
        correoLider: email,
      };
      const response = await fetch(
        "https://sarym-production-4033.up.railway.app/api/nombresColaborador",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(requestBody),
        }
      );
      const data = await response.json();
      const colaboradoresProcesados = data.map((colaborador) => ({
        id: colaborador.id,
        nombreCompleto: `${colaborador.Nombre} ${colaborador.Apellido_pat} ${colaborador.Apellido_mat}`,
      }));

      console.log("Colaboradores: ", colaboradoresProcesados);
      setColaboradores(colaboradoresProcesados);
    } catch (error) {
      console.error("Error al cargar nombres de colaboradores:", error);
    }
  };
  useEffect(() => {
    cargarColaboradores();
  }, []);
  const handleColaboradorChange = (e) => {
    const [idSeleccionado, nombreCompleto] = e.value.split("_");
    setIdColaboradorSeleccionado(idSeleccionado);
    setNombreColaboradorSeleccionado(nombreCompleto);
  };

  const handleSubmit = () => {
    // Aquí puedes enviar los datos a la base de datos MySQL utilizando Axios u otra biblioteca de HTTP.
    // Por ejemplo, puedes enviarlos a una API REST.

    const data = {
      NombreCompleto: nombreColaboradorSeleccionado,
      IDColaborador: idColaboradorSeleccionado,
      Telefono,
      FechaAsignacion,
      Descripcion,
      correoLider: email,
    };
    axios
      //.post("http://localhost:3005/guardar_datos", data)
      .post(
        "https://sarym-production-4033.up.railway.app/api/crearLlamada",
        data
      )
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
  const obtenerFechaHoraActual = () => {
    const ahora = new Date();
    const opciones = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return ahora
      .toLocaleString("en-US", opciones)
      .replace(/(\d+)\/(\d+)\/(\d+),/, "$2/$1/$3");
  };
  const opcionesColaboradores = colaboradores.map((colaborador) => ({
    label: colaborador.nombreCompleto,
    value: `${colaborador.id}_${colaborador.nombreCompleto}`,
  }));

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
      <div className="py-md-4 py-3" style={{ backgroundColor: "#F1F5F8" }}>
        <div
          className="row"
          style={{
            marginLeft: "35px",
            marginBottom: "-50px",
            marginRight: "0px",
          }}
        >
          <h2 className="titulo-cambaceo px-0 px-md-5">Agregar Llamada</h2>
        </div>

        <div
          className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-5 mt-md-4"
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
                <Dropdown
                  value={`${idColaboradorSeleccionado}_${nombreColaboradorSeleccionado}`}
                  options={opcionesColaboradores}
                  onChange={handleColaboradorChange}
                  placeholder="Selecciona un colaborador"
                  style={{ width: "100%" }}
                />
              </div>
              <div className="p-field">
                <label htmlFor="Telefono">Teléfono</label>
              </div>
              <div>
                <InputMask
                  id="Telefono"
                  value={Telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  style={{ width: "100%" }}
                  mask="(99) 9999 9999"
                  unmask={true}
                  placeholder="(55) 6789 5432"
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
                  placeholder={obtenerFechaHoraActual()}
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
                  placeholder="Describe brevemente el propósito de la llamada..."
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
