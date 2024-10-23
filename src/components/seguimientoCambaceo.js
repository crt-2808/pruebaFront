import React, { useEffect, useState, useRef } from 'react';
import Navbar from './navbar';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Download } from 'react-bootstrap-icons';
import { Tooltip } from 'primereact/tooltip';
import usuarioAnon from '../img/imagen-de-usuario-con-fondo-negro.png';
import Swal from 'sweetalert2';
import { Toast } from 'primereact/toast';
import { useAuthRedirect } from '../useAuthRedirect';
import axios from 'axios';
import '../theme.css';
import 'primereact/resources/primereact.css'; // core css
import { API_URL, fetchWithToken } from '../utils/api';

const SeguimientoCambaceo = () => {
  useAuthRedirect();
  const navigate = useNavigate();

  // Nuevo estado para los datos de los colaboradores
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [imageLoaded, setImageLoaded] = useState({});
  const [descargando, setDescargando] = useState(false);

  const toast = useRef(null);
  const showToast = () => {
    toast.current.show({
      severity: 'warn',
      summary: 'Error',
      detail: 'No logramos acceder a la imagen del usuario.',
      life: 2000,
    });
  };
  const handleImageError = (e) => {
    e.target.src = usuarioAnon; // imagen predeterminada
  };
  const generateSwalTemplate = (colaborador, type) => {
    console.log(colaborador);
    const isActive = colaborador.Activo === 1;
    return `
      <h3>Has seleccionado</h3>
      <div class='row centrar' style='overflow: hidden;'>
        <div class='col-md-8 col-xs-6'>
          <div class='card centrar p-3 mt-3'>
            <div className="user-status">
              <img
                src='${colaborador.Imagen || usuarioAnon}'
                alt="imagen de colaborador"
                onerror="this.onerror=null; this.src='${usuarioAnon}';"
                className="img-fluid"
                id="img-card"
              />
              <span
                className={'status-indicator ${
                  isActive ? 'active' : 'inactive'
                }'}
              ></span>
            </div>
            <h3>${colaborador.Nombre}</h3>
            <h4>${
              colaborador.Apellido_pat + ' ' + colaborador.Apellido_mat
            }</h4>
            <h6>${colaborador.Correo}</h6>
            <h6>${colaborador.Telefono}</h6>
          </div>
        </div>
      </div>
      <br>
      <h3>Para un seguimiento <span class="text-danger">${type}</span></h3>
    `;
  };

  const colab = async () => {
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espera un momento',
      allowOutsideClick: false,
    });
    Swal.showLoading();
    try {
      const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await fetchWithToken(`${API_URL}/colaborador`, options);
      Swal.close();
      const errorStatusCodes = [500, 404, 400];

      if (errorStatusCodes.includes(response.status)) {
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

      const data = await response.json();
      if (data.length === 0) {
        return Swal.fire({
          title: '¡Atención!',
          text: 'Todavía no hay ningún usuario registrado en tu equipo.',
          icon: 'info',
          confirmButtonText: 'Entendido',
        });
      }
      // Transformamos la data si es necesario
      const transformedData = data.map((item) => {
        if (item.Imagen === 'src') {
          return { ...item, Imagen: usuarioAnon };
        }
        return item;
      });
      setData(transformedData);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo salió mal al cargar los usuarios!',
      });
    }
  };

  const handleClick = (type, colaborador) => {
    // showToast();
    Swal.fire({
      title: 'Corrobora los datos',
      text: 'Fecha',
      icon: 'warning',
      showCancelButton: true,
      html: generateSwalTemplate(colaborador, type),
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ea4335',
      cancelButtonColor: '#333333',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/SeguimientoCambaceo/${type}/${colaborador.idUsuario}`);
      }
    });
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
  const handleDownload = async () => {
    Swal.fire({
      title: 'Descargando...',
      text: 'Por favor espera un momento',
      allowOutsideClick: false,
    });
    Swal.showLoading();
    try {
      const response = await fetchWithToken(`${API_URL}/descargarFechas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'text/csv', // Especifica el tipo de contenido que esperas recibir
        },
      });
      Swal.close();
      if (response.status === 204) {
        return Swal.fire({
          icon: 'info',
          title: 'Información',
          text: 'No hay registros para la próxima semana aún.',
        });
      }
      // Verificar si la respuesta es exitosa
      if (response.ok) {
        // Generar un enlace de descarga para el archivo CSV
        const blob = await response.blob();
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'datos.csv';
        downloadLink.click();
      } else {
        // Manejar errores de la solicitud
        console.error(
          'Error al descargar el archivo CSV:',
          response.statusText
        );
      }
    } catch (error) {
      // Manejar errores de red u otros errores
      Swal.close();
      console.error('Error al descargar el archivo CSV:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo salió mal al descargar el archivo CSV!',
      });
      console.error('Error de red:', error);
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className='fluid'>
      <Navbar></Navbar>
      <Toast ref={toast} />

      <div className='Colab'>
        <div className='container-fluid px-4'>
          <div className='row table_space mt-4'>
            <div className='col-md-12 d-flex justify-content-center align-items-center mb-3'>
              <Link to='/cambaceo'>
                <ArrowLeft className='ml-4 regreso' />
                <span id='indicador'>Cambaceo</span>
              </Link>
            </div>
          </div>
          <div className='d-flex justify-content-between align-items-center col-12 mt-5 mb-md-1 mb-sm-0 px-4'>
            <h1 className='textoSeguimiento mx-md-5 mx-sm-1'>Seguimiento</h1>
            <Download
              className='descarga-cambaceo'
              onClick={handleDownload}
              data-pr-tooltip='Descarga el cambaceo semanal de la próxima semana'
              data-pr-position='top'
            />
            <Tooltip target='.descarga-cambaceo' className='custom-tooltip' />
          </div>
          <div
            className='container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4'
            id='contenedor'
          >
            <div className='row'>
              <div className='col-md-6'>
                <h6 className='textoBuscaSeg'>
                  Selecciona al usuario<br></br>y el tipo de seguimiento
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
                    onChange={handleSearchChange}
                  />
                  <X className='clear-icon' onClick={() => setSearch('')} />
                </div>
              </div>
            </div>
            <div
              className='row align-items-center mt-sm-4 mb-sm-4 mt-md-0 mb-md-0'
              id='opcionesCambaceo'
            >
              <div className='container-fluid mt-5 mb-2'>
                <div className='row px-2 gy-4' id='Resultado'>
                  {filteredData.length > 0 ? (
                    filteredData.map((colaborador, index) => {
                      const isActive = colaborador.Activo === 1; // Obtener isActive aquí
                      return (
                        <div className='col-md-3 ' key={index}>
                          <div className='card centrar p-3'>
                            <div className='user-status'>
                              <img
                                src={colaborador.Imagen}
                                className={`img-fluid fade-in ${
                                  imageLoaded[colaborador.id] ? 'loaded' : ''
                                }`}
                                id='img-card'
                                alt='imagen de colaborador'
                                onError={handleImageError}
                                onLoad={() =>
                                  setImageLoaded((prevState) => ({
                                    ...prevState,
                                    [colaborador.id]: true,
                                  }))
                                }
                                style={
                                  imageLoaded[colaborador.id]
                                    ? { opacity: 1, visibility: 'visible' }
                                    : {
                                        opacity: 0,
                                        visibility: 'hidden',
                                        display: 'none',
                                      }
                                }
                              />
                              <span
                                className={`status-indicator ${
                                  isActive ? 'active' : 'inactive'
                                }`}
                              ></span>
                            </div>
                            <h3>{colaborador.Nombre}</h3>
                            <h4>
                              {colaborador.Apellido_pat +
                                ' ' +
                                colaborador.Apellido_mat}
                            </h4>
                            <h6 className='email'>{colaborador.Correo}</h6>
                            <h6>{colaborador.Telefono}</h6>
                            <div className='col-md-12'>
                              <div className='row'>
                                <div className='col-md-12'>
                                  <button
                                    className='btnDiario'
                                    onClick={() =>
                                      handleClick('Diario', colaborador)
                                    }
                                  >
                                    Diario
                                  </button>
                                  <button
                                    className='btnSemanal mt-md-2 mt-sm-0'
                                    onClick={() =>
                                      handleClick('Semanal', colaborador)
                                    }
                                  >
                                    Semanal
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p>
                      No se encontró ningún usuario con el nombre "{search}
                      ".
                    </p>
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
export default SeguimientoCambaceo;
