import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useUserContext } from '../../userProvider';
import Navbar from '../navbar';
import Planeador from '../../img/Planeador.png';
import { useAuthRedirect } from '../../useAuthRedirect';
import { InputTextarea } from 'primereact/inputtextarea';
import { API_URL, fetchWithToken } from '../../utils/api';
import 'primeicons/primeicons.css';
import { startTour } from '../../utils/tourConfigColab';
const upperCaseFirstLetter = (string) =>
  `${string.slice(0, 1).toUpperCase()}${string.slice(1)}`;

const lowerCaseAllWordsExceptFirstLetters = (string) =>
  string.replaceAll(
    /\S*/g,
    (word) => `${word.slice(0, 1)}${word.slice(1).toLowerCase()}`
  );

const Land_Colab = () => {
  useAuthRedirect();
  const { usuario } = useUserContext();
  const [showPopup, setShowPopup] = useState(false);
  const [liderData, setLiderData] = useState(null);
  const [showPhone, setShowPhone] = useState(false);
  const [Nombre_usuario, setUsuario] = useState('');
  const [incidenciaRegistrada, setIncidenciaRegistrada] = useState('');
  const [ventas, setVentas] = useState('');
  const [cobranza, setCobranza] = useState('');
  const [trabajoPropio, setTrabajoPropio] = useState('');
  const [userRole, setRole] = useState('');

  useEffect(() => {
    startTour('land', userRole);
  }, [userRole]);

  const cargarLider = async () => {
    try {
      const response = await fetchWithToken(`${API_URL}/lider`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const dataLider = await response.json();
      setLiderData(dataLider['lider']);
      setRole(dataLider['role']);
    } catch (error) {
      console.error('Error al obtener los datos del lider', error);
    }
  };
  useEffect(() => {
    cargarLider();
  }, []);
  useEffect(() => {
    // Ocultar el teléfono después de 10 segundos
    const timeoutId = setTimeout(() => {
      setShowPhone(false);
    }, 10000);
    // Limpieza del temporizador al desmontar el componente
    return () => clearTimeout(timeoutId);
  }, [showPhone]);
  useEffect(() => {
    const nombreUsuario = usuario.givenName;
    setUsuario(nombreUsuario);
    const fetchIncidenciaRegistrada = async () => {
      try {
        const response = await fetchWithToken(
          `${API_URL}/GetIncidenciaDiaria`,
          {
            method: 'GET',
          }
        );
        if (response.ok) {
          const data = await response.json();
          const incidencia = data.incidencia; // Acceder a la incidencia desde la respuesta JSON
          console.log('Incidencia obtenida:', incidencia);
          setIncidenciaRegistrada(incidencia);
        } else {
          console.error('Error al obtener la incidencia:', response.statusText);
        }
      } catch (error) {
        console.error('Error al realizar la solicitud:', error.message);
      }
    };

    fetchIncidenciaRegistrada();
  }, []);
  const handleClickGuardar = async () => {
    try {
      const response = await fetchWithToken(
        `${API_URL}/GuardarIncidenciaDiaria`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Incidencia: trabajoPropio }),
        }
      );
      if (response.ok) {
        console.log('Incidencia guardada correctamente');
        // Aquí puedes realizar alguna acción adicional si la incidencia se guarda con éxito
      } else {
        console.error('Error al guardar la incidencia:', response.statusText);
        // Aquí puedes manejar el error de alguna manera apropiada
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error.message);
      // Aquí puedes manejar el error de alguna manera apropiada
    } finally {
      setShowPopup(false);
    }
  };
  return (
    <div className='fluid color-land'>
      <Navbar></Navbar>
      <Dialog
        visible={showPopup}
        onHide={() => setShowPopup(false)}
        header={`Estimad@ ${Nombre_usuario}, por favor registra tus actividades para poder continuar`}
        footer={
          <div>
            <Button
              label='Guardar'
              icon='pi pi-check'
              onClick={handleClickGuardar}
            />
          </div>
        }
      >
        <div className='p-grid p-fluid'>
          <div className='p-col-12 p-md-4'>
            <span>Ventas:</span>
            <InputTextarea
              value={ventas}
              onChange={(e) => setVentas(e.target.value)}
              rows={3}
              cols={30}
            />
          </div>
          <div className='p-col-12 p-md-4'>
            <span>Cobranza:</span>
            <InputTextarea
              value={cobranza}
              onChange={(e) => setCobranza(e.target.value)}
              rows={3}
              cols={30}
            />
          </div>
          <div className='p-col-12 p-md-4'>
            <span>Trabajo Propio:</span>
            <InputTextarea
              value={trabajoPropio || incidenciaRegistrada}
              onChange={(e) => setTrabajoPropio(e.target.value)}
              rows={3}
              cols={30}
            />
          </div>
        </div>
      </Dialog>
      <div className='container land pt-4 pb-4  d-flex Colab' id='landing-p'>
        <div className='row w-100'>
          <div className='col-12 mt-2 mb-md-3 mb-sm-0'></div>
          <div className='col-12 mt-2 mb-md-2 mb-sm-0 d-sm-block d-md-flex justify-content-sm-between align-items-center text-center'>
            <h1 className='bienvenidoText'>
              Bienvenido &nbsp;
              {usuario &&
                upperCaseFirstLetter(
                  lowerCaseAllWordsExceptFirstLetters(usuario.givenName)
                )}
            </h1>
            <button
              className='btn-exportar col-md-2 col-6'
              onClick={() => setShowPopup(true)}
            >
              Agregar Incidencias
            </button>
          </div>
          <div className='container-fluid mt-2 mb-4 p-5' id='contenedor-land'>
            <div className='row pt-md-5 mt-md-4 pb-md-4 mb-md-3'>
              <div className='col-md-6'>
                <div className='row no-padding'>
                  <div className='col-12'>
                    <h4 className='subTituloLand'>Tu lider:</h4>
                    {liderData && (
                      <div>
                        <h4>
                          {liderData[0].Nombre} {liderData[0].Apellido_pat}{' '}
                          {liderData[0].Apellido_mat}
                        </h4>
                        <h5>Correo: {liderData[0].Correo}</h5>
                        <h5>
                          Teléfono:{' '}
                          {showPhone ? liderData[0].Telefono : '********'}
                          {!showPhone && (
                            <i
                              className='pi pi-eye'
                              style={{ cursor: 'pointer', marginLeft: '5px' }}
                              onClick={() => setShowPhone(true)}
                            ></i>
                          )}
                        </h5>
                        {userRole === 'coordinador' && (
                          <Link to='/SeguimientoCambaceos'>
                            <Button
                              label='Seguimiento Equipo'
                              className='p-button-outlined mt-3'
                              id='seguimiento-equipo'
                            />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className='col-md-6' id='btn-planeador'>
                <div className='row'>
                  <div className='col-12'>
                    <h4 className='subTituloLand'>Planeador</h4>
                  </div>
                  <div className='col-12'>
                    <div className='row pt-5'>
                      <div className='col-md-12'>
                        <Link to='/planeador' className='no-decoration'>
                          <img src={Planeador} alt='Boton-Editar'></img>
                          <p className='placeBtn'>Entrar</p>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Land_Colab;
