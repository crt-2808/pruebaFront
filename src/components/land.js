import React from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../userProvider';
import Navbar from './navbar';
import Agregar from '../img/Agregar.png';
import Editar from '../img/boton-editar.png';
import Planeador from '../img/Planeador.png';
import { isUserAdmin } from '../utils/auth';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useEffect } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { API_URL, fetchWithToken } from '../utils/api';

const upperCaseFirstLetter = (string) =>
  `${string.slice(0, 1).toUpperCase()}${string.slice(1)}`;

const lowerCaseAllWordsExceptFirstLetters = (string) =>
  string.replaceAll(
    /\S*/g,
    (word) => `${word.slice(0, 1)}${word.slice(1).toLowerCase()}`
  );

const Land = () => {
  const isAdmin = isUserAdmin();
  const { usuario } = useUserContext();
  const [showPopup, setShowPopup] = useState(false);
  const [ventas, setVentas] = useState('');
  const [cobranza, setCobranza] = useState('');
  const [trabajoPropio, setTrabajoPropio] = useState('');
  const [Nombre_usuario, setUsuario] = useState('');
  const [incidenciaRegistrada, setIncidenciaRegistrada] = useState('');
  const userRole = sessionStorage.getItem('userRole');

  useEffect(() => {
    const nombreUsuario = usuario.givenName;
    console.log(sessionStorage);
    console.log('Usuario', usuario);
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
    <div className={`fluid color-land ${showPopup ? 'popup-open' : ''}`}>
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
      {isAdmin ? (
        <div className='container land pt-4 pb-4  d-flex h-auto' id='landing-p'>
          <div className='row w-100'>
            <div className='col-12 mt-2 mb-md-3 mb-sm-0 d-sm-block d-md-flex justify-content-sm-between align-items-center text-center'>
              <h1 className='bienvenidoText'>
                Bienvenido &nbsp;
                {usuario &&
                  upperCaseFirstLetter(
                    lowerCaseAllWordsExceptFirstLetters(usuario.givenName)
                  )}
              </h1>
            </div>

            <div className='col-12 mt-4 p-0'>
              <div
                className='container-fluid mt-2 mb-4 p-5'
                id='contenedor-land'
              >
                <div className='row'>
                  <div className='col-12'>
                    <h2 className='tituloLand'>¿Qué deseas hacer?</h2>
                  </div>
                </div>
                <div className='row pt-md-5 mt-md-4 pb-md-4 mb-md-3'>
                  <div className='col-md-6'>
                    <div className='row no-padding'>
                      <div className='col-12'>
                        <h4 className='subTituloLand'>Usuarios</h4>
                      </div>
                      <div className='col-12'>
                        <div className='row no-padding pt-5 pl-0 pr-0'>
                          <div className='col-md-6 '>
                            <Link to='/agregarColab' className='no-decoration'>
                              <img src={Agregar} alt='Boton-Agregar'></img>
                              <p className='placeBtn'>Agregar</p>
                            </Link>
                          </div>
                          <div className='col-md-6'>
                            <Link to='/editarColab' className='no-decoration'>
                              <img src={Editar} alt='Boton-Editar'></img>
                              <p className='placeBtn'>Editar</p>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='col-md-6'>
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
                <div className='row pt-md-5 mt-md-4 pb-md-4 mb-md-3'>
                  <div className='col-md-12'>
                    <div className='row no-padding mx-5'>
                      <div className='col-12'>
                        <h4 className='subTituloLand'>Usuarios</h4>
                      </div>
                      <div className='col-md-4'>
                        <div className='row'>
                          <div className='col-12'>
                            <div className='row pt-5'>
                              <div className='col-md-12'>
                                <Link
                                  to='/crearLider'
                                  className='no-decoration'
                                >
                                  <i
                                    className='pi pi-user-plus'
                                    style={{
                                      color: '#ea4335',
                                      fontSize: '6em',
                                    }}
                                  ></i>
                                  <p className='placeBtn'>Agregar Lider</p>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-md-4'>
                        <div className='row'>
                          <div className='col-12'>
                            <div className='row pt-5'>
                              <div className='col-md-12'>
                                <Link to='/Equipos' className='no-decoration'>
                                  <i
                                    className='pi pi-users'
                                    style={{
                                      color: '#ea4335',
                                      fontSize: '6em',
                                    }}
                                  ></i>
                                  <p className='placeBtn'>Ver Equipos</p>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='col-md-4'>
                        <div className='row'>
                          <div className='col-12'>
                            <div className='row pt-5'>
                              <div className='col-md-12'>
                                <Link to='/usuarios' className='no-decoration'>
                                  <i
                                    className='pi pi pi-list'
                                    style={{
                                      color: '#ea4335',
                                      fontSize: '6em',
                                    }}
                                  ></i>
                                  <p className='placeBtn'>Todos los usuarios</p>
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
          </div>
        </div>
      ) : (
        <div
          className='container pt-4 pb-4  d-flex'
          style={{ minHeight: '88.5vh' }}
          id='landing-p'
        >
          <div className='row w-100'>
            <div className='col-12 mt-2 mb-md-2 mb-sm-0 d-sm-block d-md-flex justify-content-sm-between align-items-center text-center'>
              <h1 className='bienvenidoText'>
                Bienvenido &nbsp;
                {usuario &&
                  upperCaseFirstLetter(
                    lowerCaseAllWordsExceptFirstLetters(usuario.givenName)
                  )}
              </h1>
              <button
                className='btn-exportar col-md-2 col-6 '
                onClick={setShowPopup}
              >
                Agregar Incidencias
              </button>
            </div>

            <div className='col-12 mt-4 p-0'>
              <div
                className='container-fluid mt-2 mb-4 p-5'
                id='contenedor-land'
              >
                <div className='row'>
                  <div className='col-12'>
                    <h2 className='tituloLand'>¿Qué deseas hacer?</h2>
                  </div>
                </div>
                <div className='row pt-md-5 mt-md-4 pb-md-4 mb-md-3'>
                  <div className='col-md-6'>
                    <div className='row no-padding'>
                      <div className='col-12'>
                        <h4 className='subTituloLand'>Usuarios</h4>
                      </div>
                      <div className='col-12'>
                        <div className='row no-padding pt-5 pl-0 pr-0'>
                          {userRole !== 'gerente' ? (
                            <>
                              <div className='col-md-4 '>
                                <Link
                                  to='/agregarColab'
                                  className='no-decoration'
                                >
                                  <img src={Agregar} alt='Boton-Agregar'></img>
                                  <p className='placeBtn'>Agregar</p>
                                </Link>
                              </div>
                              <div className='col-md-4'>
                                <Link
                                  to='/editarColab'
                                  className='no-decoration'
                                >
                                  <img src={Editar} alt='Boton-Editar'></img>
                                  <p className='placeBtn'>Editar</p>
                                </Link>
                              </div>
                              <div className='col-md-4'>
                                <Link to='/Equipos' className='no-decoration'>
                                  <i
                                    className='pi pi-users'
                                    style={{
                                      color: '#ea4335',
                                      fontSize: '6.8em',
                                      width: '100%',
                                    }}
                                  ></i>
                                  <p className='placeBtn'>Equipos</p>
                                </Link>
                              </div>
                            </>
                          ) : (
                            <div className='col-md-12'>
                              <Link to='/Equipos' className='no-decoration'>
                                <i
                                  className='pi pi-users'
                                  style={{
                                    color: '#ea4335',
                                    fontSize: '6.8em',
                                    width: '100%',
                                  }}
                                ></i>
                                <p className='placeBtn'>Entrar</p>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6'>
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
      )}
    </div>
  );
};

export default Land;
