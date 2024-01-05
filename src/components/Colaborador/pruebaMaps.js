import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Form, Button, Row, Col } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import { InputTextarea } from "primereact/inputtextarea";
import Navbar from "../navbar";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../../theme.css";
import "primereact/resources/primereact.css"; // core css
import { addLocale } from "primereact/api";
// import { Button } from 'primereact/button';

// import Autocomplete from "react-google-autocomplete";
const containerStyle = {
  width: "100%",
  height: "480px",
};
const libraries = ["places"];

function Colab_PruebaMaps() {
  // Almacena la informacion del registro seleccionado
  const location = useLocation();
  const navigate=useNavigate();
  const [registro, setRegistro] = useState(null);
  const [direccionCompleta, setDireccionCompleta] = useState('');
  const [TipoEmpresa, setTipoEmpresa] = useState('');
  const [Telefono, setTelefono] = useState('');
  const [Descripcion, setDescripcion] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horario, setHorario] = useState('');
  const [horaConlcusion, setHoraConclusion]=useState('');
  const dividirFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate();
    const mes = fechaObj.getMonth() + 1;
    const año = fechaObj.getFullYear();
    return `${dia}/${mes}/${año}`;
  };

  const dividirHora = (fecha) => {
    const fechaObj = new Date(fecha);
    const horas = fechaObj.getHours();
    const minutos = fechaObj.getMinutes();
    return `${horas < 10 ? '0' : ''}${horas}:${minutos < 10 ? '0' : ''}${minutos}`;
  };
  
  useEffect(() => {
    // Verificamos si existe el objeto registro en location.state
    if (location.state && location.state.registro) {
      const { Direccion_Calle, Direccion_Num_Ext, Direccion_Num_Int, Direccion_CP, Direccion_Colonia,
        TipoEmpresa, Telefono, FechaAsignacion, FechaConclusion, Descripcion, ID
      } = location.state.registro;

      // Combina los campos de dirección para formar la dirección completa
      const direccionCompletaConcatenada = `${Direccion_Calle || ''} ${Direccion_Num_Ext || ''} ${Direccion_Num_Int || ''}, ${Direccion_CP || ''} ${Direccion_Colonia || ''}`;
      setDireccionCompleta(direccionCompletaConcatenada);
      geocodeDireccion();

      setTipoEmpresa(TipoEmpresa || '');
      setTelefono(Telefono || '');
      setDescripcion(Descripcion || '');
      setHoraInicio(horaInicio || '');
      setHoraConclusion(horaInicio || '');
      setHorario(horario || '');


      // Divide la fecha para "Fecha Inicio"
      setHoraInicio(dividirFecha(FechaAsignacion));
      // Divide la fecha para "Fecha Fin"
      setHoraConclusion(dividirFecha(FechaConclusion))
      // Divide las horas para "Horario"
      setHorario(`${dividirHora(FechaAsignacion)} - ${dividirHora(FechaConclusion)}`);

      // Almacena el objeto registro en el estado
      setRegistro(location.state.registro);    
    }
  }, [location.state]);
  
  
  // Componentes de la direccion
  const [map, setMap] = useState(null);
  const [direccion, setDireccion] = useState("");
  const [direccionCoords, setDireccionCoords] = useState(null);
  const [center, setCenter] = useState({
    lat: 23.3557,
    lng: -99.1845,
  });
  const onLoad=(map)=>{
    setMap(map);
  }
  const onUnmount=()=>{
    setMap(null);
  }
  const geocodeDireccion=async()=>{
    try{
      const response=await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          direccionCompleta
        )}&key=AIzaSyCYTnjfbc1xKJkFQxnEXtx1yLVgKu2K3IY`
      );
      const data= await response.json();
      if(data.results && data.results.length >0){
        const location=data.results[0].geometry.location;
        setDireccionCoords(location);
        setCenter(location);
      }
    }catch(error){
      console.log("Error al geocodificar la direccion: ", error)
    }
  };

  const handleIncidenciaClick=(registro)=>{

      navigate("/Colaborador/Incidencia", { state: { registro } });
  }

  useEffect(() => {
    if (direccionCompleta) {
      geocodeDireccion();
    }
  }, [direccionCompleta]); // Dependencia de direccionCompleta
  // URL de Google Maps
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    direccionCompleta
  )}`;


  if(registro && registro.Tipo=="Cambaceo_Diario"){
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
            <Link to="/Colaborador/Cambaceo_Diario">
              <ArrowLeft className="ml-4 regreso" />
              <span style={{ marginBottom: "100px" }} id="indicador">
                Menu Cambaceo
              </span>
            </Link>
          </div>
        </div>
        <LoadScript
          googleMapsApiKey="AIzaSyCYTnjfbc1xKJkFQxnEXtx1yLVgKu2K3IY"
          libraries={libraries}
        >
  
  
          <div className="py-md-4" style={{ backgroundColor: "#F1F5F8" }}>
            <div
              className="row"
              style={{
                marginLeft: "35px",
                marginBottom: "-50px",
                marginRight: "0px",
              }}
            >
              <h2 className="titulo-cambaceo px-5 ">Cambaceo Diario</h2>
            </div>
  
            <div
              className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4"
              id="contenedor-cambaceo"
            >
              <Form>
                <Row className="mb-5"> 
                  <Col xs={12} md={6}>
                    <div>
                      <h5 style={{ textAlign: "left" }}>Empresa</h5>
                      <InputTextarea
                        type="text"
                        placeholder="Ingresa tu nombre completo"
                        value={TipoEmpresa}
                        disabled
                        className="w-100"
                        rows={1}
                      />
                    </div>
                    <div style={{ marginTop: "15px" }}>
                      <h5 style={{ textAlign: "left" }}>Telefono</h5>
                      <InputTextarea
                        type="text"
                        placeholder="Ingresa tu telefono"
                        value={Telefono}
                        disabled
                        className="w-100"
                        rows={1}
                      />
                    </div>
                    <div style={{ marginTop: "15px" }}>
                      <h5 style={{ textAlign: "left" }}>Dirección</h5>
  
                      <InputTextarea
                        type="text"
                        placeholder="Ingresa tu dirección"
                        value={direccionCompleta ||" "}
                        disabled
                        className="w-100"
                      />
                    </div>
                    <div style={{ marginTop: "15px" }}>
                      <h5 style={{ textAlign: "left" }}>Descripcion</h5>
                      <InputTextarea
                        rows={4}
                        placeholder="Descripcion de la actividad diaria"
                        value={Descripcion}
                        disabled
                        className="w-100"
                      />
                    </div>
                    <div style={{ marginTop: "15px" }}>
                      <Row>
                        <Col md={6}>
                          <h6 style={{ textAlign: "left" }}>Fecha Inicio</h6>
                          <InputTextarea
                            id="fecha-inicio"
                            value={horaInicio}
                            disabled
                            className="w-100"
                            rows={1}
                          />
                        </Col>
                        <Col md={6}>
                          <h6 style={{ textAlign: "left" }}>Horario</h6>
                          <InputTextarea
                            id="horario"
                            value={horario}
                            disabled
                            className="w-100"
                            rows={1}
                          />
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col xs={12} md={6} className="mt-3">
                  <Row className="mb-5" style={{textAlign:"right", marginTop:"-3.5rem"}}>
                  <Col xs={12} md={12}>
                    <Button variant="danger" rounded="true" style={{marginBottom:"-2.7rem"}} onClick={()=>handleIncidenciaClick(registro)}>Agregar Incidencia</Button>
                  </Col>
                  </Row>
                  <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={direccionCoords || center}
                      zoom={16}
                      onLoad={onLoad}
                      onUnmount={onUnmount}
                    >
                      {direccionCoords && <Marker position={direccionCoords} />}
                    </GoogleMap>
                    <Row>
                      <div
                        style={{ marginTop: "20px" }}
                        className="d-flex justify-content-end"
                      >
                        <Button className="btn-exportar">
                          <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "white", textDecoration: "none" }}
                            className="btn "
                          >
                            Abrir en Google Maps
                          </a>
                        </Button>
                      </div>
                    </Row>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
          </LoadScript>
      </div>
    );
  }else if(registro && registro.Tipo=="Cambaceo_Semanal"){
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
            <Link to="/Colaborador/Cambaceo_Semanal">
              <ArrowLeft className="ml-4 regreso" />
              <span style={{ marginBottom: "100px" }} id="indicador">
                Menu Cambaceo
              </span>
            </Link>
          </div>
        </div>
        <LoadScript
          googleMapsApiKey="AIzaSyCYTnjfbc1xKJkFQxnEXtx1yLVgKu2K3IY"
          libraries={libraries}
        >
  
  
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
            >
              <Form>
                <Row className="mb-5">
                  <Col xs={12} md={6}>
                    <div>
                      <h5 style={{ textAlign: "left" }}>Empresa</h5>
                      <InputTextarea
                        type="text"
                        placeholder="Ingresa tu nombre completo"
                        value={TipoEmpresa}
                        disabled
                        className="w-100"
                        rows={1}
                      />
                    </div>
                    <div style={{ marginTop: "15px" }}>
                      <h5 style={{ textAlign: "left" }}>Telefono</h5>
                      <InputTextarea
                        type="text"
                        placeholder="Ingresa tu telefono"
                        value={Telefono}
                        disabled
                        className="w-100"
                        rows={1}
                      />
                    </div>
                    <div style={{ marginTop: "15px" }}>
                      <h5 style={{ textAlign: "left" }}>Dirección</h5>
  
                      <InputTextarea
                        type="text"
                        placeholder="Ingresa tu dirección"
                        value={direccionCompleta ||" "}
                        disabled
                        className="w-100"
                      />
                    </div>
                    <div style={{ marginTop: "15px" }}>
                      <h5 style={{ textAlign: "left" }}>Descripcion</h5>
                      <InputTextarea
                        rows={4}
                        placeholder="Descripcion de la actividad diaria"
                        value={Descripcion}
                        disabled
                        className="w-100"
                      />
                    </div>
                    <div style={{ marginTop: "15px" }}>
                      <Row>
                        <Col md={6}>
                          <h6 style={{ textAlign: "left" }}>Fecha Inicio</h6>
                          <InputTextarea
                            id="fecha-inicio"
                            value={horaInicio}
                            disabled
                            className="w-100"
                            rows={1}
                          />
                        </Col>
                        <Col md={6}>
                          <h6 style={{ textAlign: "left" }}>Horario</h6>
                          <InputTextarea
                            id="horario"
                            value={horario}
                            disabled
                            className="w-100"
                            rows={1}
                          />
                        </Col>
                      </Row>
                      <Row>
                      <Col md={6}>
                          <h6 style={{ textAlign: "left" }}>Fecha Conlcusion</h6>
                          <InputTextarea
                            id="fecha-conlcusion"
                            value={horaConlcusion}
                            disabled
                            className="w-100"
                            rows={1}
                          />
                        </Col>

                      </Row>
                    </div>
                  </Col>
                  <Col xs={12} md={6} className="mt-3">
                  <Row className="mb-5" style={{textAlign:"right", marginTop:"-3.5rem"}}>
                  <Col xs={12} md={12}>
                    <Button variant="danger" rounded="true" style={{marginBottom:"-2.7rem"}} onClick={()=>handleIncidenciaClick(registro)}>Agregar Incidencia</Button>
                  </Col>
                  </Row>
                  <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={direccionCoords || center}
                      zoom={16}
                      onLoad={onLoad}
                      onUnmount={onUnmount}
                    >
                      {direccionCoords && <Marker position={direccionCoords} />}
                    </GoogleMap>
                    <Row>
                      <div
                        style={{ marginTop: "20px" }}
                        className="d-flex justify-content-end"
                      >
                        <Button className="btn-exportar">
                          <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "white", textDecoration: "none" }}
                            className="btn "
                          >
                            Abrir en Google Maps
                          </a>
                        </Button>
                      </div>
                    </Row>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
          </LoadScript>
      </div>
    );
  }else{
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
            <Link to="/Colaborador/Visita_Programada">
              <ArrowLeft className="ml-4 regreso" />
              <span style={{ marginBottom: "100px" }} id="indicador">
                Menu Visita
              </span>
            </Link>
          </div>
        </div>
        <LoadScript
          googleMapsApiKey="AIzaSyCYTnjfbc1xKJkFQxnEXtx1yLVgKu2K3IY"
          libraries={libraries}
        >
  
  
          <div className="py-md-4" style={{ backgroundColor: "#F1F5F8" }}>
            <div
              className="row"
              style={{
                marginLeft: "35px",
                marginBottom: "-50px",
                marginRight: "0px",
              }}
            >
              <h2 className="titulo-cambaceo px-5 ">Visita Programada {horaInicio}</h2>
            </div>
  
            <div
              className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4"
              id="contenedor-cambaceo"
            >
              <Form>
                <Row className="mb-5">
                  <Col xs={12} md={6}>
                    <div>
                      <h5 style={{ textAlign: "left" }}>Empresa</h5>
                      <InputTextarea
                        type="text"
                        placeholder="Ingresa tu nombre completo"
                        value={TipoEmpresa}
                        disabled
                        className="w-100"
                        rows={1}
                      />
                    </div>
                    <div style={{ marginTop: "15px" }}>
                      <h5 style={{ textAlign: "left" }}>Telefono</h5>
                      <InputTextarea
                        type="text"
                        placeholder="Ingresa tu telefono"
                        value={Telefono}
                        disabled
                        className="w-100"
                        rows={1}
                      />
                    </div>
                    <div style={{ marginTop: "15px" }}>
                      <h5 style={{ textAlign: "left" }}>Dirección</h5>
  
                      <InputTextarea
                        type="text"
                        placeholder="Ingresa tu dirección"
                        value={direccionCompleta ||" "}
                        disabled
                        className="w-100"
                      />
                    </div>
                    <div style={{ marginTop: "15px" }}>
                      <h5 style={{ textAlign: "left" }}>Descripcion</h5>
                      <InputTextarea
                        rows={4}
                        placeholder="Descripcion de la actividad diaria"
                        value={Descripcion}
                        disabled
                        className="w-100"
                      />
                    </div>
                    <div style={{ marginTop: "15px" }}>
                      <Row>
                        <Col md={6}>
                          <h6 style={{ textAlign: "left" }}>Fecha Inicio</h6>
                          <InputTextarea
                            id="fecha-inicio"
                            value={horaInicio}
                            disabled
                            className="w-100"
                            rows={1}
                          />
                        </Col>
                        <Col md={6}>
                          <h6 style={{ textAlign: "left" }}>Horario</h6>
                          <InputTextarea
                            id="horario"
                            value={horario}
                            disabled
                            className="w-100"
                            rows={1}
                          />
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col xs={12} md={6} className="mt-3">
                  <Row className="mb-5" style={{textAlign:"right", marginTop:"-3.5rem"}}>
                  <Col xs={12} md={12}>
                    <Button variant="danger" rounded="true" style={{marginBottom:"-2.7rem"}} onClick={()=>handleIncidenciaClick(registro)}>Agregar Incidencia</Button>
                  </Col>
                  </Row>
                  <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={direccionCoords || center}
                      zoom={16}
                      onLoad={onLoad}
                      onUnmount={onUnmount}
                    >
                      {direccionCoords && <Marker position={direccionCoords} />}
                    </GoogleMap>
                    <Row>
                      <div
                        style={{ marginTop: "20px" }}
                        className="d-flex justify-content-end"
                      >
                        <Button className="btn-exportar">
                          <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "white", textDecoration: "none" }}
                            className="btn "
                          >
                            Abrir en Google Maps
                          </a>
                        </Button>
                      </div>
                    </Row>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
          </LoadScript>
      </div>
    );
  }
}
export default Colab_PruebaMaps;