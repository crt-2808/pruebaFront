import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "react-bootstrap-icons";
import { InputTextarea } from "primereact/inputtextarea";
import Navbar from "../navbar";
import { Link } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const AgregarIncidencia = () => {
  const navigate=useNavigate();
  const location = useLocation();
  const [idRegistro, setIDRegistro] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [tipoEmpresa, setTipoEmpresa] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccionCompleta, setDireccionCompleta] = useState("");
  const [fechaAsignacion, setFechaAsignacion] = useState("");
  const [incidentes, setIncidentes] = useState("");
  const [tipo, setTipo]=useState("");
  useEffect(() => {
    if (location.state && location.state.registro) {
      const { ID } = location.state.registro;
      setIDRegistro(ID || 0);

      // Realiza la solicitud al backend
      axios
        .get(`http://localhost:3005/api/getPlanificador/${ID}`)
        .then((response) => {
          // Maneja la respuesta de la solicitud
          console.log(response.data); // Aquí deberías tener los datos de la base de datos

          // Accede al primer elemento del array (si existe) y establece los estados
          const primerElemento = response.data[0];
          if (primerElemento) {
            setNombreCompleto(primerElemento.NombreCompleto);
            setTipoEmpresa(primerElemento.TipoEmpresa);
            setTelefono(primerElemento.Telefono);
            setDireccionCompleta(construirDireccionCompleta(primerElemento));
            setFechaAsignacion(formatoFecha(primerElemento.FechaAsignacion));
            setIncidentes(primerElemento.Incidentes);
            setTipo(primerElemento.Tipo)
          }
        })
        .catch((error) => {
          // Maneja los errores de la solicitud
          console.error("Error al obtener datos:", error);
        });
    }
  }, [location.state]);

  const formatoFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate();
    const mes = fechaObj.getMonth() + 1; // ¡Los meses son indexados desde 0!
    const año = fechaObj.getFullYear();
    const horas = fechaObj.getHours();
    const minutos = fechaObj.getMinutes();

    // Asegúrate de agregar ceros a la izquierda si el número es menor a 10
    const formatoDia = dia < 10 ? `0${dia}` : dia;
    const formatoMes = mes < 10 ? `0${mes}` : mes;
    const formatoHoras = horas < 10 ? `0${horas}` : horas;
    const formatoMinutos = minutos < 10 ? `0${minutos}` : minutos;

    return `${formatoDia}/${formatoMes}/${año} ${formatoHoras}:${formatoMinutos}`;
  };
  // Función para construir la dirección completa
  const construirDireccionCompleta = (datos) => {
    const {
      Direccion_Calle,
      Direccion_Num_Ext,
      Direccion_Num_Int,
      Direccion_Colonia,
      Direccion_CP,
    } = datos;

    return `${Direccion_Calle} ${Direccion_Num_Ext} ${
      Direccion_Num_Int ? `, ${Direccion_Num_Int}` : ""
    }, ${Direccion_Colonia}, ${Direccion_CP}`;
  };

  const manejoIncidencia = () => {
    const datosIncidencia = {
      ID: idRegistro,
      Incidentes: incidentes,
    };

    axios
      .put(`http://localhost:3005/api/putPlanificador/${idRegistro}`, datosIncidencia)
      .then((response) => {
        console.log(response.data);
        // Muestra una alerta de confirmación con sweetalert2
        Swal.fire({
          icon: "success",
          title: "Incidencia agregada con éxito",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .finally(
        navigate("/Colaborador/land")
      )
      .catch((error) => {
        console.error("Error al agregar incidencia:", error);

        // Muestra una alerta de error con sweetalert2
        Swal.fire({
          icon: "error",
          title: "Error al agregar incidencia",
          text: "Hubo un problema al procesar tu solicitud. Inténtalo de nuevo más tarde.",
        });
      });
  };

  const abrirAplicacionTelefono = () => {
    window.location.href = `tel:${telefono}`;
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
          <Link to="/Colaborador/Planeador">
            <ArrowLeft className="ml-4 regreso" />
            <span style={{ marginBottom: "100px" }} id="indicador">
              Planeador
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
          <h2 className="titulo-cambaceo px-5 ">Incidencia de {tipo.replace(/_/g, ' ')}</h2>
        </div>

        <div
          className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4"
          id="contenedor-cambaceo"
        >
          <Form>
            <Row className="mb-5">
              <Col xs={12} md={6}>
                <div>
                  <h5 style={{ textAlign: "left" }}>ID</h5>
                  <InputTextarea
                    type="text"
                    placeholder="El campo no es obligatorio"
                    value={idRegistro}
                    disabled
                    className="w-100"
                    rows={1}
                  />
                </div>
                <div>
                  <h5 style={{ textAlign: "left" }}>Nombre</h5>
                  <InputTextarea
                    type="text"
                    placeholder="El campo no es obligatorio"
                    value={nombreCompleto}
                    disabled
                    className="w-100"
                    rows={1}
                  />  
                </div>
                <div>
                  <h5 style={{ textAlign: "left" }}>Empresa</h5>
                  <InputTextarea
                    type="text"
                    placeholder="El campo no es obligatorio"
                    value={tipoEmpresa}
                    disabled
                    className="w-100"
                    rows={1}
                  />
                </div>
                <div>
                  <h5 style={{ textAlign: "left" }}>Telefono</h5>
                  <a  style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} href={`tel:${telefono}`} onClick={abrirAplicacionTelefono}> 
                  <InputTextarea
                    type="text"
                    placeholder="El campo no es obligatorio"
                    value={telefono}
                    disabled
                    className="w-100"
                    rows={1}
                    style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                  />
                  </a>
                </div>
                <div>
                  <h5 style={{ textAlign: "left" }}>Direccion</h5>
                  <InputTextarea
                    type="text"
                    placeholder="El campo no es obligatorio"
                    value={direccionCompleta}
                    disabled
                    className="w-100"
                    rows={2}
                  />
                </div>
                <div>
                  <h5 style={{ textAlign: "left" }}>Fecha</h5>
                  <InputTextarea
                    type="text"
                    placeholder="El campo no es obligatorio"
                    value={fechaAsignacion}
                    disabled
                    className="w-100"
                    rows={1}
                  />
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div>
                  <h5 style={{ textAlign: "left" }}>Incidentes</h5>
                  <InputTextarea
                    type="text"
                    placeholder="Ingresa cualquier detalle relevante"
                    value={incidentes}
                    onChange={(e)=>setIncidentes(e.target.value)}
                    className="w-100"
                    rows={10}
                  />
                </div>
                <button type="button" class="btn btn-success btn-lg" onClick={manejoIncidencia}>
                  Agregar
                </button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AgregarIncidencia;
