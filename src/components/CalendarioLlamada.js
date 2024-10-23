import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import Swal from 'sweetalert2';
import Navbar from './navbar';
import { ArrowLeft } from 'react-bootstrap-icons';
import { InputMask } from 'primereact/inputmask';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Form } from 'react-bootstrap';
import { useAuthRedirect } from '../useAuthRedirect';
import { formatearFecha } from '../utils/utils';
import { CalendarioEsp } from '../utils/calendarLocale';
import { API_URL, fetchWithToken } from '../utils/api';
import { MultiSelect } from 'primereact/multiselect';

function CalendarioLlamada() {
  useAuthRedirect();
  CalendarioEsp();
  const navigate = useNavigate();
  const [Telefono, setTelefono] = useState('');
  const [FechaAsignacion, setFecha] = useState(null);
  const [Descripcion, setDescripcion] = useState('');
  const [DocumentosReal, setDocumentos] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [colaboradoresSeleccionados, setColaboradoresSeleccionados] = useState(
    []
  );
  // Función para cargar los nombres de los colaboradores
  const cargarColaboradores = async () => {
    try {
      const response = await fetchWithToken(`${API_URL}/nombresColaborador`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      const colaboradoresProcesados = data.map((colaborador) => ({
        id: colaborador.idUsuario,
        nombreCompleto: `${colaborador.Nombre} ${colaborador.Apellido_pat} ${colaborador.Apellido_mat}`,
      }));

      console.log('Colaboradores: ', colaboradoresProcesados);
      setColaboradores(colaboradoresProcesados);
    } catch (error) {
      console.error('Error al cargar nombres de colaboradores:', error);
    }
  };
  const verificaDatos = () => {
    if (colaboradoresSeleccionados.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Selecciona al menos un asesor',
        timer: 1200,
        timerProgressBar: true,
        backdrop: `rgba(36,32,32,0.65)`,
      });
      return false;
    }
    if (!Telefono) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ingresa un número de teléfono',
        timer: 1200,
        timerProgressBar: true,
        backdrop: `rgba(36,32,32,0.65)`,
      });
      return false;
    }
    if (!FechaAsignacion) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Selecciona una fecha y hora',
        timer: 1200,
        timerProgressBar: true,
        backdrop: `rgba(36,32,32,0.65)`,
      });
      return false;
    }
    if (!Descripcion) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ingresa una descripción',
        timer: 1200,
        timerProgressBar: true,
        backdrop: `rgba(36,32,32,0.65)`,
      });
      return false;
    }

    // Si todos los campos son válidos
    return true;
  };

  useEffect(() => {
    cargarColaboradores();
  }, []);
  // const handleColaboradorChange = (e) => {
  //   const [idSeleccionado, nombreCompleto] = e.value.split("_");
  //   setIdColaboradorSeleccionado(idSeleccionado);
  //   setNombreColaboradorSeleccionado(nombreCompleto);
  // };
  const handleColaboradoresChange = (e) => {
    setColaboradoresSeleccionados(e.value);
    console.log('Colaboradores seleccionados:', e.value);
  };

  const handleSubmit = () => {
    if (!verificaDatos()) {
      return; // Detiene la ejecución si hay un error
    }
    // Formatear la fecha y hora
    const fechaAsignacionFormateada = formatearFecha(FechaAsignacion);
    const idsUsuariosSeleccionados = colaboradoresSeleccionados.map(
      (colaboradorSeleccionado) => {
        const [id] = colaboradorSeleccionado.split('_');
        return id;
      }
    );
    console.log('Fecha y hora formateada:', fechaAsignacionFormateada);
    const data = {
      // NombreCompleto: nombreColaboradorSeleccionado,
      // idUsuario: idColaboradorSeleccionado,
      Telefono,
      FechaAsignacion: fechaAsignacionFormateada,
      Descripcion,
      idUsuarios: idsUsuariosSeleccionados,
    };
    console.log('Datos a enviar:', data);
    fetchWithToken(`${API_URL}/crearLlamada`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json(); // Parsea la respuesta a JSON
      })
      .then((responseData) => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Los datos se han registrado correctamente',
          timer: 1200,
          timerProgressBar: true,
          backdrop: `rgba(36,32,32,0.65)`,
        }).then(() => {
          navigate('/Llamada');
        });
      })
      .catch((error) => {
        // Muestra una alerta de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al registrar los datos',
          timer: 1200,
          timerProgressBar: true,
          backdrop: `
        rgba(36,32,32,0.65)
        
      `,
        });
        console.error('Error al enviar los datos al servidor:', error);
      });
  };
  const obtenerFechaHoraActual = () => {
    const ahora = new Date();
    const opciones = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return ahora
      .toLocaleString('en-US', opciones)
      .replace(/(\d+)\/(\d+)\/(\d+),/, '$2/$1/$3');
  };
  const opcionesColaboradores = colaboradores.map((colaborador) => ({
    label: colaborador.nombreCompleto,
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
            <b>Ningún</b> asesor seleccionado
          </>
        ) : (
          <>
            <b>{length}</b> asesor{length > 1 ? 'es' : ''} seleccionado
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
          <Link to='/Llamada'>
            <ArrowLeft className='ml-4 regreso' />
            <span style={{ marginBottom: '100px' }} id='indicador'>
              Menu Llamada
            </span>
          </Link>
        </div>
      </div>
      <div
        className='py-md-4 py-3'
        style={{ backgroundColor: '#F1F5F8', minHeight: '86vh' }}
      >
        <div
          className='row mt-4 mt-md-0'
          style={{
            marginLeft: '35px',
            marginBottom: '-50px',
            marginRight: '0px',
          }}
        >
          <h2 className='titulo-cambaceo px-0 px-md-5'>Agregar Llamada</h2>
        </div>

        <div
          className='container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-2 mt-md-4'
          id='contenedor-cambaceo'
          style={{ marginBottom: '0px', transform: 'translateY(50px)' }}
        >
          <Row className='mb-3'>
            <Col xs={12} md={6}>
              <div className='p-field'>
                <label htmlFor='NombreCompleto'>
                  Asesores
                  <br />
                </label>
              </div>
              <div>
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
              </div>
              <div className='p-field'>
                <label htmlFor='Telefono'>Teléfono</label>
              </div>
              <div>
                <InputMask
                  id='Telefono'
                  value={Telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  style={{ width: '100%' }}
                  mask='(99) 9999 9999'
                  unmask={true}
                  placeholder='(55) 6789 5432'
                />
              </div>
              <div className='p-field'>
                <label htmlFor='FechaAsignacion'>Fecha y Hora</label>
              </div>
              <div>
                <Calendar
                  id='FechaAsignacion'
                  value={FechaAsignacion}
                  onChange={(e) => setFecha(e.value)}
                  showIcon
                  showTime
                  hourFormat='12'
                  dateFormat='dd/mm/yy'
                  locale='es'
                  style={{ width: '100%' }}
                  placeholder={obtenerFechaHoraActual()}
                />
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className='p-field'>
                <label htmlFor='Descripcion'>Descripción</label>
              </div>
              <div>
                <InputTextarea
                  id='Descripcion'
                  autoResize
                  value={Descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder='Describe brevemente el propósito de la llamada...'
                  rows={7}
                  style={{ width: '100%' }}
                />
              </div>
              {/* <div className='p-field'>
                <label>Documentos</label>
                <FileUpload
                  name='DocumentosReal'
                  url='https://your-server.com/upload'
                  mode='advanced'
                  accept='image/*,application/pdf'
                  onSelect={(e) => setDocumentos(e.files)}
                  multiple
                  auto
                  disabled
                  style={{ width: '100%' }}
                />
              </div> */}
            </Col>
            <Col className='text-end px-3'>
              <Button
                label='Confirmar'
                onClick={handleSubmit}
                // severity='success'
                style={{ width: '8rem' }}
                className='mt-4 btn-exportar'
              />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
export default CalendarioLlamada;
