import React from 'react';
import Navbar from './navbar';

const Blocked = () => {
  return (
    <div>
      <div className='fluid color-land'>
        <Navbar></Navbar>
        <div className='container land pt-4 pb-4  d-flex' id='landing-p'>
          <div className='row w-100'>
            <div className='col-12 mt-2 mb-md-3 mb-sm-0'></div>

            <h1>Usuario No Registrado</h1>
            <p>
              Tu cuenta de Google no está registrada en nuestra aplicación. Por
              favor, contacta con el equipo de soporte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blocked;
