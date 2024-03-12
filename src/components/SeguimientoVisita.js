import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'react-bootstrap-icons';
import Navbar from './navbar';
import { Row, Col } from 'react-bootstrap';
import { useAuthRedirect } from '../useAuthRedirect';
import { useUserContext } from '../userProvider';
import { API_URL, fetchWithToken } from '../utils/api';
// Componente principal
const SeguimientoVisita = () => {
  useAuthRedirect();
  // Estado para almacenar los datos de la base de datos
  const [registros, setRegistros] = useState([]);
  const [modoCuestionario, setModoCuestionario] = useState(false);
  const [mostrarEspera, setMostrarEspera] = useState(true);
  const [registroSeleccionado, setregistroSeleccionado] = useState(null);
  const [incidentesEditados, setIncidentesEditados] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');

  const [busqueda, setBusqueda] = useState('');

  // Función para cargar los registros desde el servidor
  const cargarRegistros = async () => {
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espera un momento',
      allowOutsideClick: false,
    });
    Swal.showLoading();
    try {
      const response = await fetchWithToken(`${API_URL}/visitaProgramada`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      Swal.close();
      // Muestra el mensaje de espera al cargar registros

      if (!response.ok) {
        console.error('Error al obtener registros:', response);
        return Swal.fire({
          icon: 'error',
          title: 'Se produjo un error',
          text: 'No se pudieron cargar los registros',
          timer: 2200,
          timerProgressBar: true,
        });
      }
      console.log(response);
      const data = await response.json();
      console.log(data);
      if (data.length === 0) {
        return Swal.fire({
          title: '¡Atención!',
          text: 'No hay registros disponibles.',
          icon: 'info',
          confirmButtonText: 'Entendido',
        });
      }
      setRegistros(data);
      setMostrarEspera(false);
    } catch (error) {
      console.error('Error al obtener registros:', error);
      Swal.close();
      return Swal.fire({
        icon: 'error',
        title: 'Se produjo un error',
        text: 'Error al cargar los registros',
        timer: 2200,
        timerProgressBar: true,
      });
    }
  };

  // Efecto para cargar los registros cuando el componente se monta
  useEffect(() => {
    cargarRegistros();
  }, []);

  // Función para formatear la fecha en un formato legible
  const formatearFecha = (fecha) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('es-ES', options).format(new Date(fecha));
  };

  // Función para manejar el clic en el botón "Ver"
  const handleVerClick = (registro) => {
    // Formatea la fecha antes de mostrar el diálogo
    const fechaFormateada = formatearFecha(registro.FechaAsignacion);
    // Muestra el diálogo con SweetAlert2
    Swal.fire({
      icon: 'warning',
      title: 'Corrobora los datos seleccionados',
      html: `
        <h2>${registro.TipoEmpresa}</h2>
        <h4>${fechaFormateada}</h4>
        <p>${registro.NombreCompleto}</p>
        <h3>Para un  <span class="text-danger">Seguimiento</span></h3>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ea4335',
      cancelButtonColor: '#333333',
    }).then((result) => {
      // Maneja la lógica después de hacer clic en Confirmar o Cancelar
      if (result.isConfirmed) {
        // Lógica para confirmar
        setregistroSeleccionado(registro);
        setIncidentesEditados(registro.Incidentes);
        setModoCuestionario(true);
      }
    });
  };
  const handleCancelarCuestionario = () => {
    setModoCuestionario(false);
  };
  const handleIncidentesChange = (e) => {
    setIncidentesEditados(e.target.value);
  };
  const handleGuardarCuestionario = async () => {
    if (incidentesEditados === registroSeleccionado?.Incidentes) {
      Swal.fire({
        icon: 'error',
        title: 'No se detectaron cambios',
        text: 'Edita las incidencias antes de guardar.',
      });
      return;
    }
    const envioIncidentes = { incidencia: incidentesEditados };
    try {
      const response = await fetch(
        `${API_URL}/incidencia/${registroSeleccionado.ID}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(envioIncidentes),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Incidencia registrada correctamente',
          showConfirmButton: false,
          timer: 1500,
        });
        // Actualizar el registro en el estado local
        const registrosActualizados = registros.map((registro) => {
          if (registro.ID === registroSeleccionado.ID) {
            return { ...registro, Incidentes: incidentesEditados };
          }
          return registro;
        });
        setRegistros(registrosActualizados);
        setModoCuestionario(false);
      } else {
        console.log(response);
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar la incidencia',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };
  const filtrarRegistros = () => {
    // Filtra los registros por NombreCompleto
    const registrosFiltrados = registros.filter((registro) =>
      registro.NombreCompleto.toLowerCase().includes(busqueda.toLowerCase())
    );
    return registrosFiltrados;
  };

  const handleBuscar = () => {};

  // Renderiza las seguimientovisita con los datos de la base de datos
  return (
    <div className='fluid'>
      <Navbar></Navbar>
      <div className='Colab'>
        <div className='container-fluid px-4'>
          <div className='col-md-12 d-flex justify-content-center align-items-center mb-3'>
            <Link to='/VisitaProgramada'>
              <ArrowLeft className='ml-4 regreso' />
              <span id='indicador'>Menu Visita Programada</span>
            </Link>
          </div>
          <div className='col-12 mt-5 mb-md-1 mb-sm-0 px-4'>
            <h1 className='textoSeguimiento mx-md-5 mx-sm-1'>Seguimiento</h1>
          </div>
          <div
            className='container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4'
            id='contenedor'
          >
            {modoCuestionario ? null : (
              <div className='row'>
                <div className='col-md-6'>
                  <h6 className='textoBuscaSeg'>
                    Selecciona el registro<br></br>para dar seguimiento
                  </h6>
                </div>
                <div className='col-md-6'>
                  <div className='input-wrapper'>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='Buscar por Nombre'
                      aria-label='Buscar'
                      aria-describedby='basic-addon1'
                      value={search}
                      onChange={filtrarRegistros}
                    />
                    <X className='clear-icon' onClick={() => setSearch('')} />
                  </div>
                </div>
              </div>
            )}
            <div
              className='row align-items-center mt-sm-4 mb-sm-4 mt-md-0 mb-md-0'
              id='opcionesCambaceo'
            >
              <div className='container-fluid mt-5 mb-2'>
                <div className='row px-2 gy-4' id='Resultado'>
                  {modoCuestionario ? (
                    // Renderiza la vista de cuestionario en dos columnas
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      <Row className='mb-5'>
                        <Col xs={12} md={6}>
                          <label>Nombre Completo:</label>
                          <InputText
                            value={registroSeleccionado?.NombreCompleto}
                            disabled
                            style={{ width: '100%' }}
                          />
                          <label>Empresa:</label>
                          <InputText
                            value={registroSeleccionado?.TipoEmpresa}
                            disabled
                            style={{ width: '100%' }}
                          />
                          <label>Telefono:</label>
                          <InputText
                            value={registroSeleccionado?.Telefono}
                            disabled
                            style={{ width: '100%' }}
                          />
                          <label>Sitio Web:</label>
                          <InputText
                            value={registroSeleccionado?.Sitioweb}
                            disabled
                            style={{ width: '100%' }}
                          />
                          <label>Dirreccion:</label>
                          <InputText
                            value={registroSeleccionado?.Direccion}
                            disabled
                            style={{ width: '100%' }}
                          />

                          <label>Fecha Asignacion:</label>
                          <InputText
                            value={formatearFecha(
                              registroSeleccionado?.FechaAsignacion
                            )}
                            disabled
                            style={{ width: '100%' }}
                          />
                        </Col>
                        <Col xs={12} md={6}>
                          <div style={{ marginBottom: '10px' }}>
                            <label>Descripcion:</label>
                            <InputTextarea
                              autoResize={true}
                              rows={5}
                              value={registroSeleccionado?.Descripcion}
                              style={{ width: '100%' }}
                              disabled
                            />
                          </div>

                          {/* Campo de texto editable */}
                          <div style={{ marginBottom: '10px' }}>
                            <label>Incidencias:</label>
                            <InputTextarea
                              autoResize={true}
                              rows={5}
                              onChange={handleIncidentesChange}
                              value={incidentesEditados}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              marginTop: '10px',
                            }}
                          >
                            <Button
                              label='Guardar'
                              style={{ marginRight: '10px' }}
                              onClick={handleGuardarCuestionario}
                            />
                            <Button
                              label='Cancelar'
                              onClick={handleCancelarCuestionario}
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ) : (
                    // Renderiza la vista de seguimientovisita
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      {registros.map((registro, index) => (
                        <div className='col-md-3' key={index}>
                          <div
                            className='card centrar p-3'
                            style={{
                              width: '15rem',
                              height: '16rem',
                              alignItems: 'center',
                              overflow: 'hidden',
                              marginBottom: '15px',
                              maxWidth:
                                window.innerWidth <= 768 ? '9rem' : '100%',
                            }}
                          >
                            <h2
                              className='card-title'
                              style={{
                                fontSize: '1.5rem', // Tamaño predeterminado
                                margin: 0, // Elimina cualquier margen adicional que pueda afectar
                              }}
                            >
                              {registro.TipoEmpresa}
                            </h2>
                            <h4 className='card-subtitle mb-2 text-muted'>
                              {formatearFecha(registro.FechaAsignacion)}
                            </h4>
                            <p className='card-text text-truncate email'>
                              {registro.NombreCompleto}
                            </p>
                            <button
                              className='btnDiario'
                              onClick={() => handleVerClick(registro)}
                            >
                              Ver
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SeguimientoVisita;
