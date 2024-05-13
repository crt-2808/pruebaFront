import React, { useEffect, useState, useRef } from "react";
import Navbar from "./navbar";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, X, Download } from "react-bootstrap-icons";
import usuarioAnon from "../img/imagen-de-usuario-con-fondo-negro.png";
import Swal from "sweetalert2";
import { Toast } from "primereact/toast";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useAuthRedirect } from "../useAuthRedirect";
import "../theme.css";
import "primereact/resources/primereact.css"; // core css
import { API_URL, fetchWithToken } from "../utils/api";
import { Dialog } from 'primereact/dialog';
import { useParams } from 'react-router-dom';
import { Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { MultiSelect } from "primereact/multiselect";

function EditarEquipo(){
    useAuthRedirect();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();
      const [colaboradores, setColaboradores] = useState([]);
      const [colaboradoresSeleccionados, setColaboradoresSeleccionados] = useState(
        []
      );
    const { id } = useParams();
    const idequipo_seleccionado=id
    const [nombreEquipo, setNombreEquipo] = useState("")
    const [showModal, setShowModal] = useState(false);
    // Nuevo estado para los datos de los colaboradores
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [imageLoaded, setImageLoaded] = useState({});
    const toast = useRef(null);
    const showToast = () => {
        toast.current.show({
        severity: "warn",
        summary: "Error",
        detail: "No logramos acceder a la imagen del colaborador.",
        life: 2000,
        });
    };
    const handleImageError = (e) => {
      e.target.src = usuarioAnon; // imagen predeterminada
    };
    const colab = async () => {
        Swal.fire({
        title: "Cargando...",
        text: "Por favor espera un momento",
        allowOutsideClick: false,
        });
        Swal.showLoading();
        try {
        const options = {
            method: "GET",
            mode: "cors",
            headers: {
            "Content-Type": "application/json",
            },
        };
        const response = await fetchWithToken(`${API_URL}/GetEquipo/${idequipo_seleccionado}`, options);
        Swal.close();
        const errorStatusCodes = [500, 404, 400];
        if (errorStatusCodes.includes(response.status)) {
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
        const data = await response.json();
        setNombreEquipo(data[0].NombreEquipo)
        if (data.length === 0) {
            return Swal.fire({
            title: "¡Atención!",
            text: "Todavía no hay ningún colaborador registrado en tu equipo.",
            icon: "info",
            confirmButtonText: "Entendido",
            });
        }
        // Transformamos la data si es necesario
        const transformedData = data.map((item) => {
            if (item.Imagen === "src") {
            return { ...item, Imagen: usuarioAnon };
            }
            return item;
        });
        setData(transformedData);
        } catch (error) {
        console.log(error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Algo salió mal al cargar los colaboradores!",
        });
        }
    };

    const deleteColaborador = async (equipoId, usuarioId) => {
        try {
            const options = {
                method: "DELETE",
                mode: "cors",
                headers: {
                "Content-Type": "application/json",
                },
            };
            const response = await fetchWithToken(`${API_URL}/DeleteUserEquipo/${equipoId}/${usuarioId}`, options);
            if (response.ok){
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario eliminado',
                    text: 'El usuario fue eliminado correctamente.',
                    timer: 1200,
                    timerProgressBar: true
                  }). then(()=>{
                    window.location.reload();
                  });
            }
            const errorStatusCodes = [500, 404, 400];
        if (errorStatusCodes.includes(response.status)) {
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
            console.error('Error eliminando el colaborador del equipo:', error);
            Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Algo salió mal al eliminar al colaborador!",
        });
        }
        };

    const handleDeleteConfirmation = (colaborador) => {
        Swal.fire({
          title: '¿Estás seguro?',
          text: `¿Realmente deseas eliminar a ${colaborador.Nombre} del equipo?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            console.log(colaborador.IDEquipo)
            console.log(colaborador.idUsuario)
            deleteColaborador(colaborador.IDEquipo,colaborador.idUsuario)
          }
        });
      };
      const handleOpenModal = () => {
        setShowModal(true);
      };
    
      const handleCloseModal = () => {
        setShowModal(false);
      };
      const onSubmit = async (data) => {
        console.log("Esta es la data del onsubmit ", data);
        // Comenta todo lo relacionado con el envío de datos a la base de datos
        
        if (!data) {
          Swal.fire({
            icon: "error",
            title: "Se requiere llenar el formulario",
            text: "Completa todos los campos obligatorios",
            timer: 1200,
            timerProgressBar: true,
            backdrop: "rgba(36,32,32,0.65)",
          });
          return;
        }
        try {
          console.log("Esta data es del try ", data);
          
          const idsUsuariosSeleccionados = colaboradoresSeleccionados.map(
            (colaboradorSeleccionado) => {
              const [id] = colaboradorSeleccionado.split("_");
              return id;
            }
          );
          data = {
            ...data,
            equipoId:idequipo_seleccionado,
            usuarios: idsUsuariosSeleccionados,
          };
          let config = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          };
          try {
            Swal.fire({
              title: "Cargando...",
              text: "Por favor espera un momento",
              allowOutsideClick: false,
            });
            handleCloseModal();
            Swal.showLoading();
            let res = await fetchWithToken(`${API_URL}/AddUsersToTeam`, config);
            Swal.close();
           
            let json = await res.json();
            console.log(json);
            Swal.fire({
              icon: "success",
              title: "Se agregó tu equipo correctamente",
              text: "UDA",
              timer: 1200,
              timerProgressBar: true,
              backdrop: `
                    rgba(36,32,32,0.65)
                    
                  `,
            }).then(() => {
              navigate("/Equipos");
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
          console.log("Error al enviar los datos al servidor:", error);
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
        
      };
      
      
      const handleColaboradoresChange = (e) => {
        setColaboradoresSeleccionados(e.value);
        console.log("Colaboradores seleccionados:", e.value);
      };
      const cargarColaboradores = async () => {
        try {
          const response = await fetchWithToken(`${API_URL}/nombresColaborador`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          const colaboradoresProcesados = data.map((colaborador) => ({
            id: colaborador.idUsuario,
            nombreCompleto: `${colaborador.Nombre} ${colaborador.Apellido_pat} ${colaborador.Apellido_mat}`,
          }));
          setColaboradores(colaboradoresProcesados);
        } catch (error) {
          console.error("Error al cargar nombres de colaboradores:", error);
        }
      };
      useEffect(() => {
        cargarColaboradores();
      }, []);
      const opcionesColaboradores = colaboradores.map((colaborador) => ({
        label: colaborador.nombreCompleto,
        value: `${colaborador.id}_${colaborador.nombreCompleto}`,
      }));
      const panelFooterTemplate = () => {
        const length = colaboradoresSeleccionados
          ? colaboradoresSeleccionados.length
          : 0;
    
        return (
          <div className="py-2 px-3">
            {length === 0 ? (
              <>
                <b>Ningún</b> colaborador seleccionado
              </>
            ) : (
              <>
                <b>{length}</b> colaborador{length > 1 ? "es" : ""} seleccionado
                {length > 1 ? "s" : ""}.
              </>
            )}
          </div>
        );
      };
    


    useEffect(() => {
      colab();
    }, []);
    useEffect(() => {
      const filteredColab = data.filter((colaborador) =>
        colaborador.Nombre.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(filteredColab);
    }, [search, data]);
    const handleSearchChange = (e) => {
      setSearch(e.target.value);
    };
    
    return (
      <div className="fluid">
        <Navbar></Navbar>
        <Toast ref={toast} />
        <div className="Colab">
          <div className="container-fluid px-4">
            <div className="row table_space mt-4">
              <div className="col-md-12 d-flex justify-content-center align-items-center mb-3">
                <Link to="/Equipos">
                  <ArrowLeft className="ml-4 regreso" />
                  <span id="indicador">Equipos</span>
                </Link>
              </div>
            </div>
            <div
              className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4"
              id="contenedor"
            >
              <div className="row">
                <div className="col-md-6">
                <h1 className="textoSeguimiento mx-md-5 mx-sm-1">{nombreEquipo}</h1>
                </div>
                <div className='col-md-6'>
                  <div className="row ">

                  <div className="col-md-6 ">

                        <div
                          className='p-input-icon-left'
                          style={{
                            display: 'inline-block',
                            widows: '100%',
                          }}
                        >
                          <i className='pi pi-search' />
                          <InputText
                            value={search}
                            onChange={handleSearchChange}
                            placeholder='Buscar'
                            className="w-100"
                          />
                        </div>
                  </div>
                      <div className='col-md-6'>
                          
                        <Button
                          label='Agregar Miembros'
                          icon='pi pi-plus'
                          severity='Danger'
                          
                          onClick={handleOpenModal}
                        />
                      </div>
                  </div>
                      </div>
                
              </div>
              <div
                className="row align-items-center mt-sm-4 mb-sm-4 mt-md-0 mb-md-0"
                id="opcionesCambaceo"
              >
                <div className="container-fluid mt-5 mb-2">
                  <div className="row px-2 gy-4" id="Resultado">
                    {filteredData.length > 0 ? (
                      filteredData.map((colaborador, index) => {
                        return (
                          <div className="col-md-3 " key={index}>
                            <div className="card centrar p-3">
                            <Button
                                icon="pi pi-minus"
                                className="p-button-rounded p-button-danger boton-eliminar"
                                
                                onClick={() => handleDeleteConfirmation(colaborador)}
                            />
                              <div className="user-status">
                                <img
                                  src={colaborador.Imagen}
                                  className={`img-fluid fade-in ${
                                    imageLoaded[colaborador.id] ? "loaded" : ""
                                  }`}
                                  id="img-card"
                                  alt="imagen de colaborador"
                                  onError={handleImageError}
                                  onLoad={() =>
                                    setImageLoaded((prevState) => ({
                                      ...prevState,
                                      [colaborador.id]: true,
                                    }))
                                  }
                                  style={
                                    imageLoaded[colaborador.id]
                                      ? { opacity: 1, visibility: "visible" }
                                      : {
                                          opacity: 0,
                                          visibility: "hidden",
                                          display: "none",
                                        }
                                  }
                                />
                              </div>
                              <h3>{colaborador.Nombre}</h3>
                              <h4>
                                {colaborador.Apellido_pat +
                                  " " +
                                  colaborador.Apellido_mat}
                              </h4>
                              <h6 className="email">{colaborador.Correo}</h6>
                              <h6>{colaborador.Telefono}</h6>
                              <div className="col-md-12">
                                <div className="row">
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p>
                        No se encontró ningún colaborador con el nombre "{search}
                        ".
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Dialog
        visible={showModal}
        style={{ width: '50vw' }}
        onHide={handleCloseModal} // Cierra el modal al hacer clic en cualquier parte fuera de él
        header="Agregar Miembros"
        footer={
          <div>
            <Button label="Cancelar" onClick={handleCloseModal} />
            <Button label="Aceptar" type="botton" onClick={handleSubmit(onSubmit)} className="p-button-primary" />
          </div>
        }
      >
        {/* Contenido del modal */}
        <b><p>Selecciona los colaboradores que deseas agregar.</p></b>
        <Form onSubmit={handleSubmit(onSubmit)} className="mt-2 mt-md-0">
            <Row className="mb-2">
              <Col xs={12} md={12}>
                <div style={{ marginTop: "15px" }}>
                  <Form.Group>
                    <MultiSelect
                      value={colaboradoresSeleccionados}
                      options={opcionesColaboradores}
                      onChange={handleColaboradoresChange}
                      panelFooterTemplate={panelFooterTemplate}
                      placeholder="Selecciona colaboradores"
                      display="chip"
                      style={{ width: "100%" }}
                      filter
                    />
                  </Form.Group>
                </div>
              </Col>
            </Row>
          </Form>
      </Dialog>
      </div>
    );
}
export default EditarEquipo