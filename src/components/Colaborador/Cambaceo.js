import React from 'react';
import Navbar from '../navbar';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'react-bootstrap-icons';
import Diario from '../../img/Diario.svg';
import Semanal from '../../img/Semanal.svg';
import { useAuthRedirect } from '../../useAuthRedirect';
import { useUserContext } from '../../userProvider';
import { useEffect } from 'react';

const Cambaceo_Colab = () => {
  useAuthRedirect();
  const { toggleUser, usuario } = useUserContext();
  console.log(usuario);

  useEffect(() => {
    const options = {
      method: 'GET',
      mode: 'cors',
    };
  }, []);
  useAuthRedirect();
  return (
    <div className='fluid'>
      <Navbar></Navbar>
      <div className='Colab'>
        <div className='container-fluid px-4'>
          <div className='row table_space mt-4'>
            <div className='col-md-12 d-flex justify-content-center align-items-center mb-3'>
              <Link to='/planeador'>
                <ArrowLeft className='ml-4 regreso' />
                <span id='indicador'>Planeador</span>
              </Link>
            </div>
          </div>
          <div
            className='container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4'
            id='contenedor'
          >
            <div className='row'>
              <h2 className='titulo-cambaceo '>Cambaceo</h2>
            </div>
            <div
              className='row align-items-center mt-sm-4 mb-sm-4'
              id='opcionesCambaceo'
            >
              <div className='col-md-6'>
                <Link to='/cambaceoDiario' className='links-cambaceo'>
                  <img
                    src={Diario}
                    alt='Imagen Ilustrativa'
                    className='img-fluid'
                  ></img>
                  <h3 className='opcionCambaceo'>Diario</h3>
                </Link>
              </div>
              <div className='col-md-6'>
                <Link to='/cambaceoSemanal' className='links-cambaceo'>
                  <img
                    src={Semanal}
                    alt='Imagen Ilustrativa'
                    className='img-fluid'
                  ></img>
                  <h3 className='opcionCambaceo'>Semanal</h3>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Cambaceo_Colab;
