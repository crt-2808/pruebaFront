import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "./navbar";
import { formatearFecha } from "../utils/utils";
import { ArrowLeft } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Form } from "react-bootstrap";
import { useAuthRedirect } from "../useAuthRedirect";
import { useUserContext } from "../userProvider";
import { CalendarioEsp } from "../utils/calendarLocale";

function CalendarioVisita() {
  useAuthRedirect();
  CalendarioEsp();
  const navigate = useNavigate();
  const [Telefono, setTelefono] = useState("");
  const [FechaAsignacion, setFecha] = useState(null);
  const [Direccion_Calle, setDireccion_Calle] = useState("");
  const [Direccion_Num_Ext, setDireccion_Num_Ext] = useState("");
  const [Direccion_Num_Int, setDireccion_Num_Int] = useState("");
  const [Direccion_CP, setDireccion_CP] = useState("");
  const [Direccion_Colonia, setDireccion_Colonia] = useState("");
  const [TipoEmpresa, setTipoEmpresa] = useState("");
  const [Sitioweb, setSitioweb] = useState("");
  const [Descripcion, setDescripcion] = useState("");
  const { usuario } = useUserContext();
  const email = usuario.email;
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
    const fechaAsignacionFormateada = formatearFecha(FechaAsignacion);

    const data = {
      NombreCompleto: nombreColaboradorSeleccionado,
      Telefono,
      FechaAsignacion: fechaAsignacionFormateada,
      Direccion_Calle,
      Direccion_Num_Ext,
      Direccion_Num_Int,
      Direccion_CP,
      Direccion_Colonia,
      TipoEmpresa,
      Sitioweb,
      Descripcion,
      correoLider: email,
      IDColaborador: idColaboradorSeleccionado,
    };
    console.log(data);
    axios
      .post(
        "https://sarym-production-4033.up.railway.app/api/crearVisitaProgramada",
        data
      )
      //.post("http://localhost:3005/guardar_datos_visita", data)
      .then((response) => {
        // Muestra una alerta de éxito
        console.log(response);
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
          navigate("/VisitaProgramada");
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
          <Link to="/VisitaProgramada">
            <ArrowLeft className="ml-4 regreso" />
            <span style={{ marginBottom: "100px" }} id="indicador">
              Menu Visita
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
          <h2 className="titulo-cambaceo px-0 px-md-5 ">Agregar Visita</h2>
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
                  mask="(99) 9999 9999"
                  unmask={true}
                  placeholder="(55) 6789 5432"
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
                  dateFormat="dd/mm/yy"
                  placeholder={obtenerFechaHoraActual()}
                  style={{ width: "100%" }}
                  locale="es"
                />
              </div>
              <div className="p-field">
                <label htmlFor="Direccion_Calle">
                  Calle
                  <br />
                </label>
              </div>
              <div>
                <InputText
                  id="Direccion_Calle"
                  value={Direccion_Calle}
                  onChange={(e) => setDireccion_Calle(e.target.value)}
                  style={{ width: "100%" }}
                  placeholder="Av. Revolución"
                />
              </div>
              <div className="p-field">
                <label htmlFor="Direccion_Num_Ext">
                  Número Exterior
                  <br />
                </label>
              </div>
              <div>
                <InputText
                  id="Direccion_Num_Ext"
                  value={Direccion_Num_Ext}
                  onChange={(e) => setDireccion_Num_Ext(e.target.value)}
                  style={{ width: "100%" }}
                  placeholder="123"
                />
              </div>

              <div className="p-field">
                <label htmlFor="Direccion_Num_Int">
                  Número Interior
                  <br />
                </label>
              </div>
              <div>
                <InputText
                  id="Direccion_Num_Int"
                  value={Direccion_Num_Int}
                  onChange={(e) => setDireccion_Num_Int(e.target.value)}
                  style={{ width: "100%" }}
                  placeholder=" 2B (opcional)"
                />
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="p-field">
                <label htmlFor="Direccion_CP">
                  Codigo Postal
                  <br />
                </label>
              </div>
              <div>
                <InputText
                  id="Direccion_CP"
                  value={Direccion_CP}
                  onChange={(e) => setDireccion_CP(e.target.value)}
                  style={{ width: "100%" }}
                  placeholder="03100"
                />
              </div>

              <div className="p-field">
                <label htmlFor="Direccion_Colonia">
                  Colonia
                  <br />
                </label>
              </div>
              <div>
                <InputText
                  id="Direccion_Colonia"
                  value={Direccion_Colonia}
                  onChange={(e) => setDireccion_Colonia(e.target.value)}
                  style={{ width: "100%" }}
                  placeholder="Condesa"
                />
              </div>

              <div className="p-field">
                <label htmlFor="TipoEmpresa">
                  Empresa
                  <br />
                </label>
              </div>
              <div>
                <InputText
                  id="TipoEmpresa"
                  value={TipoEmpresa}
                  onChange={(e) => setTipoEmpresa(e.target.value)}
                  style={{ width: "100%" }}
                  placeholder="Tech Solutions"
                />
              </div>

              <div className="p-field">
                <label htmlFor="Sitioweb">
                  Sitio Web
                  <br />
                </label>
              </div>
              <div>
                <InputText
                  id="Sitioweb"
                  value={Sitioweb}
                  onChange={(e) => setSitioweb(e.target.value)}
                  style={{ width: "100%" }}
                  placeholder="https://www.ejemplo.com"
                />
              </div>

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
                  placeholder="Describe brevemente el propósito de la visita..."
                />
              </div>
            </Col>
          </Row>
          <Button
            label="Confirmar"
            onClick={handleSubmit}
            severity="success"
            style={{ width: "100%", marginTop: "50 px" }}
          />
        </div>
      </div>
    </div>
  );
}
export default CalendarioVisita;
