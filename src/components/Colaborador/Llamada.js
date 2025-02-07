import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'react-bootstrap-icons';
import Navbar from '../navbar';
import { useAuthRedirect } from '../../useAuthRedirect';
import { useUserContext } from '../../userProvider';
import { API_URL, fetchWithToken } from '../../utils/api';
import { showInfoAlert, showLoadingAlert } from '../../utils/alerts';

// Componente principal
const Llamada_Colab = () => {
  useAuthRedirect();
  const [registros, setRegistros] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const navigate = useNavigate();
  const getInfo = async () => {
    showLoadingAlert();
    try {
      const response = await fetchWithToken(`${API_URL}/ColaboradorLlamada`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('esta es la data2:', data);
      if (data && data.length > 0) {
        // Obtener la fecha de inicio del mes
        const now = new Date();
        const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);

        // Filtrar registros dentro del rango mensual
        const registrosMes = data.filter((registro) => {
          const fechaAsignacion = new Date(registro.FechaAsignacion);
          return fechaAsignacion >= inicioMes;
        });

        // Actualizar los registros con los filtrados por mes
        setRegistros(registrosMes);
        if (registrosMes.length === 0) {
          showInfoAlert('No hay registros para esta semana');
        }

        // Resto del código...
      } else {
        // Mostrar alerta si no hay registros
        showInfoAlert('No hay registros para esta semana');
      }
    } catch (error) {
      console.error('Error al obtener los datos del getInfo', error);
    }
  };
  useEffect(() => {
    getInfo();
  }, []);

  useEffect(() => {
    const filteredregistros = registros.filter((registro) =>
      registro.Telefono.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filteredregistros);
  }, [search, registros]);
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleVerClick = (registro) => {
    navigate('/Colaborador/Incidencia', { state: { registro } });
  };
  const formatearFecha = (fecha) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('es-ES', options).format(new Date(fecha));
  };
  const obtenerEstadoRegistro = (registro) => {
    const fechaActual = new Date();
    const fechaAsignacion = new Date(registro.FechaAsignacion);
    const fechaConclusion = new Date(registro.FechaConclusion);

    if (fechaActual > fechaConclusion) {
      return (
        <div className='badge rounded-pill text-bg-success estatus'>
          <h6>Terminado</h6>
        </div>
      );
    } else if (
      fechaActual >= fechaAsignacion &&
      fechaActual <= fechaConclusion
    ) {
      return (
        <div className='badge rounded-pill text-bg-warning estatus'>
          <h6>En curso</h6>
        </div>
      );
    } else {
      return (
        <div className='badge rounded-pill text-bg-secondary estatus'>
          <h6>Programada</h6>
        </div>
      );
    }
  };

  return (
    <div className='fluid'>
      <Navbar></Navbar>
      <div className='Colab'>
        <div className='container-fluid px-4'>
          <div className='col-md-12 d-flex justify-content-center align-items-center mb-3'>
            <Link to='/planeador'>
              <ArrowLeft className='ml-4 regreso' />
              <span id='indicador'>Planeador</span>
            </Link>
          </div>
          <div className='col-12 mt-5 mb-md-1 mb-sm-0 px-4'>
            <h1 className='textoSeguimiento mx-md-5 mx-sm-1'>Llamada</h1>
          </div>
          <div
            className='container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4'
            id='contenedor'
          >
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
                    placeholder='Buscar por número de teléfono'
                    aria-label='Buscar'
                    aria-describedby='basic-addon1'
                    value={search}
                    onChange={handleSearchChange}
                  />
                  <X className='clear-icon' onClick={() => setSearch('')} />
                </div>
              </div>
            </div>
            {/* Renderizar la información según la existencia de registros */}
            {registros.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
                className='py-3'
              >
                {filteredData.map((registro, index) => (
                  <div className='col-md-3' key={index}>
                    <div
                      className='card centrar p-3'
                      style={{
                        width: '15rem',
                        height: '16rem',
                        alignItems: 'center',
                        marginBottom: '15px',
                        maxWidth: window.innerWidth <= 768 ? '9rem' : '100%',
                        position: 'relative',
                      }}
                    >
                      <div className='alerta-esquina'>
                        {obtenerEstadoRegistro(registro)}
                      </div>
                      <h2
                        className='card-title'
                        style={{
                          fontSize: '1.5rem', // Tamaño predeterminado
                          margin: 0, // Elimina cualquier margen adicional que pueda afectar
                          '@media (maxWidth: 768px)': {
                            fontSize: '1rem', // Ajusta el tamaño del texto para pantallas más pequeñas
                          },
                        }}
                      >
                        {registro.Telefono}
                      </h2>
                      <h4 className='card-subtitle mb-2 text-muted'>
                        {formatearFecha(registro.FechaAsignacion)}
                      </h4>
                      <p className='card-text text-truncate'>
                        {registro.Descripcion.split(',')[0].trim().slice(0, 20)}
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
            ) : (
              // Mostrar mensaje si no hay registros
              <p>No hay registros para mostrar.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Llamada_Colab;
