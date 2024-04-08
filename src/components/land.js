import React from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../userProvider';
import Navbar from './navbar';
import Agregar from '../img/Agregar.png';
import Editar from '../img/boton-editar.png';
import Planeador from '../img/Planeador.png';
import { isUserAdmin } from '../utils/auth';
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

  return (
    <div className='fluid color-land'>
      <Navbar></Navbar>
      <div className='container land pt-4 pb-4  d-flex' id='landing-p'>
        <div className='row w-100'>
          <div className='col-12 mt-2 mb-md-3 mb-sm-0 d-sm-block d-md-flex justify-content-sm-between align-items-center text-center'>
            <h1 className='bienvenidoText'>
              Bienvenido &nbsp;
              {usuario &&
                upperCaseFirstLetter(
                  lowerCaseAllWordsExceptFirstLetters(usuario.givenName)
                )}
            </h1>
            {isAdmin && (
              <Link to='/crearLider' className='no-decoration'>
                <button className='btn-exportar'>Agregar Lider</button>
              </Link>
            )}
          </div>

          <div className='col-12 mt-4 p-0'>
            <div className='container-fluid mt-2 mb-4 p-5' id='contenedor-land'>
              <div className='row'>
                <div className='col-12'>
                  <h2 className='tituloLand'>¿Qué deseas hacer?</h2>
                </div>
              </div>
              <div className='row pt-md-5 mt-md-4 pb-md-4 mb-md-3'>
                <div className='col-md-6'>
                  <div className='row no-padding'>
                    <div className='col-12'>
                      <h4 className='subTituloLand'>Colaborador</h4>
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

                {isAdmin ? (
                  <>
                    <div className='col-md-3'>
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
                    <div className='col-md-3'>
                      <div className='row'>
                        <div className='col-12'>
                          <h4 className='subTituloLand'>Usuarios</h4>
                        </div>
                        <div className='col-12'>
                          <div className='row pt-5'>
                            <div className='col-md-12'>
                              <Link to='/usuarios' className='no-decoration'>
                                <i
                                  className='pi pi-users'
                                  style={{
                                    color: '#ea4335',
                                    fontSize: '6em',
                                  }}
                                ></i>
                                <p className='placeBtn'>Entrar</p>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Land;
