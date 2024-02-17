import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../userProvider';
import Navbar from '../navbar';
import Planeador from '../../img/Planeador.png';
import { useAuthRedirect } from '../../useAuthRedirect';
import { API_URL, fetchWithToken } from '../../utils/api';
import 'primeicons/primeicons.css';
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
  const [liderData, setLiderData] = useState(null);
  const [showPhone, setShowPhone] = useState(false);

  const cargarLider = async () => {
    try {
      const response = await fetchWithToken(`${API_URL}/lider`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const dataLider = await response.json();
      console.log(dataLider);
      setLiderData(dataLider);
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

  return (
    <div className='fluid color-land'>
      <Navbar></Navbar>
      <div className='container land pt-4 pb-4  d-flex' id='landing-p'>
        <div className='row w-100'>
          <div className='col-12 mt-2 mb-md-3 mb-sm-0'></div>

          <div className='col-12 mt-4 p-0'>
            <h1 className='bienvenidoText'>
              Bienvenido &nbsp;
              {usuario &&
                upperCaseFirstLetter(
                  lowerCaseAllWordsExceptFirstLetters(usuario.givenName)
                )}
            </h1>
            <div className='container-fluid mt-2 mb-4 p-5' id='contenedor-land'>
              <div className='row pt-md-5 mt-md-4 pb-md-4 mb-md-3'>
                <div className='col-md-6'>
                  <div className='row no-padding'>
                    <div className='col-12'>
                      <h4 className='subTituloLand'>Lider</h4>
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
                        </div>
                      )}
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
    </div>
  );
};

export default Land_Colab;
