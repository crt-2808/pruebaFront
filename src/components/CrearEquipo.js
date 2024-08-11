import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import 'primeicons/primeicons.css'; //iconos
import { MultiSelect } from 'primereact/multiselect';
import { Form, Row, Col } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import Navbar from './navbar';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../theme.css';
import 'primereact/resources/primereact.css'; // core css
import { fetchWithToken } from '../utils/api';
import { API_URL } from '../utils/api';
import { Button } from 'primereact/button';
import { useLocation } from "react-router-dom"; // Importar useLocation
import { Message } from "primereact/message";

function CrearEquipo() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const idGerente = params.get("idGerente");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [colaboradores, setColaboradores] = useState([]);
  const [colaboradoresSeleccionados, setColaboradoresSeleccionados] = useState(
    []
  );

  useEffect(() => {
    if (idGerente) {
      setMessage(`Se agregará el líder con ID: ${idGerente}`);
    }
  }, [idGerente]);


  const onSubmit = async (data) => {
    console.log(data);
    if (!data) {
      Swal.fire({
        icon: 'error',
        title: 'Se requiere llenar el formulario',
        text: 'Completa todos los campos obligatorios',
        timer: 1200,
        timerProgressBar: true,
        backdrop: 'rgba(36,32,32,0.65)',
      });
      return;
    }
    try {
      console.log(data);
      const idsUsuariosSeleccionados = colaboradoresSeleccionados.map(
        (colaboradorSeleccionado) => {
          const [id] = colaboradorSeleccionado.split('_');
          return id;
        }
      );
      data = {
        ...data,
        usuarios: idsUsuariosSeleccionados,
        idGerente: idGerente
      };
      let config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
      try {
        Swal.fire({
          title: 'Cargando...',
          text: 'Por favor espera un momento',
          allowOutsideClick: false,
        });
        Swal.showLoading();
        let res = await fetchWithToken(`${API_URL}/CreateEquipo`, config);
        Swal.close();
        let json = await res.json();
        console.log(json);
        Swal.fire({
          icon: 'success',
          title: 'Se agregó tu equipo correctamente',
          text: 'UDA',
          timer: 1200,
          timerProgressBar: true,
          backdrop: `
          rgba(36,32,32,0.65)
          
        `,
        }).then(() => {
          navigate('/Equipos');
        });
      } catch (error) {
        console.log(error);
        return Swal.fire({
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
    } catch (error) {
      console.log('Error al enviar los datos al servidor:', error);
      return Swal.fire({
        icon: 'error',
        title: 'Se requiere llenar el formulario',
        text: 'UDA',
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
    console.log('Colaboradores seleccionados:', e.value);
  };
  const cargarColaboradores = async () => {
    try {
      let url = `${API_URL}/equipos/usuarios/sin-equipo`;
    if (idGerente) {
      url += `?idGerente=${idGerente}`;
    }
      const response = await fetchWithToken(
        url,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      console.log(data)
      const colaboradoresProcesados = data.map((colaborador) => ({
        id: colaborador.idUsuario,
        nombreCompleto: colaborador.NombreCompleto,
        rol:colaborador.Rol,
      }));

      console.log('Colaboradores: ', colaboradoresProcesados);
      setColaboradores(colaboradoresProcesados);
    } catch (error) {
      console.error('Error al cargar nombres de colaboradores:', error);
    }
  };

  useEffect(() => {
    cargarColaboradores();
  }, []);
  const opcionesColaboradores = colaboradores.map((colaborador) => ({
    label: `${colaborador.nombreCompleto} (${colaborador.rol})}`,
    value: `${colaborador.id}_${colaborador.nombreCompleto}`,
    
  }));
  const panelFooterTemplate = () => {
    const length = colaboradoresSeleccionados
      ? colaboradoresSeleccionados.length
      : 0;

    return (
      <div className='py-2 px-3'>
        {length === 0 ? (
          <>
            <b>Ningún</b> colaborador seleccionado
          </>
        ) : (
          <>
            <b>{length}</b> colaborador{length > 1 ? 'es' : ''} seleccionado
            {length > 1 ? 's' : ''}.
          </>
        )}
      </div>
    );
  };

  return (
    <div className='fluid'>
      <Navbar style={{ backgroundColor: '##F8F9FA' }}></Navbar>
      <div style={{ backgroundColor: '#F1F5F8' }}>
        <div
          style={{
            paddingTop: '10px',
            paddingBottom: '10px',
            backgroundColor: '#F1F5F8',
          }}
        >
          <Link to={idGerente ? -1 : "/Equipos"}>
            <ArrowLeft className="ml-4 regreso" />
            <span style={{ marginBottom: "100px" }} id="indicador">
              {idGerente ? "Regresar al gerente" : "Equipos"}
            </span>
          </Link>
        </div>
      </div>

      <div
        className='py-md-4'
        style={{
          backgroundColor: '#F1F5F8',
          padding: '1.5rem 0',
          minHeight: '87vh',
        }}
      >
        <div className='col-12 px-5'>
          <h2 className='titulo-cambaceo px-5 '>Crear Equipo</h2>
          {message && (
            <Message
              severity="info"
              text={message}
              style={{ marginBottom: "1rem" }}
            />
          )}
        </div>

        <div
          className='container-fluid mt-md-2 mb-md-5 p-md-5 p-3 mb-4 mt-4'
          id='contenedor-cambaceo'
        >
          <Form onSubmit={handleSubmit(onSubmit)} className='mt-2 mt-md-0'>
            <Row className='mb-2'>
              <Col xs={12} md={6}>
                <div style={{ marginTop: '15px' }}>
                  <Form.Group>
                    <h5 style={{ textAlign: 'left' }}>Nombre del Equipo </h5>
                    <InputText
                      
                      placeholder='Selecciona un nombre apropiado para el equipo'
                      {...register('nombre', {
                        required: 'El nombre debe ser uno valido',
                      })}
                      style={{ width: '100%' }}
                    />
                    {errors.nombre && (
                      <small className='p-error'>{errors.nombre.message}</small>
                    )}
                  </Form.Group>
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div style={{ marginTop: '15px' }}>
                  <Form.Group>
                    <h5 style={{ textAlign: 'left' }}>Colaboradores </h5>
                    <MultiSelect
                      value={colaboradoresSeleccionados}
                      options={opcionesColaboradores}
                      onChange={handleColaboradoresChange}
                      panelFooterTemplate={panelFooterTemplate}
                      placeholder='Selecciona colaboradores'
                      display='chip'
                      style={{ width: '100%' }}
                      filter
                    />
                  </Form.Group>
                </div>
                <div
                  style={{
                    marginTop: '15px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Button
                    label='Crear Equipo'
                    severity='danger'
                    raised
                    type='submit'
                    value='Enviar'
                  />
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
}
export default CrearEquipo;
