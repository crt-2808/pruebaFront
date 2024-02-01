import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';

const NotFound = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    if (showAlert) {
      const showAlertFunction = async () => {
        await Swal.fire({
          title: 'Usuario autorizado',
          text: 'Si los problemas persiste, comunicate con el equipo de TI',
          icon: 'error',
          timer: 10000,
          showConfirmButton: false,
          timerProgressBar: true,
        });

        // Después de 10 segundos, ocultar la alerta y forzar una actualización del componente
        setShowAlert(false);
      };

      showAlertFunction();
    }
  }, [showAlert]);

  useEffect(() => {
    // Esta parte se ejecutará cuando el componente vuelva a renderizarse
    if (!showAlert) {
      // Aquí rediriges a la página anterior después de 10 segundos
      const timeoutId = setTimeout(() => {
        navigate(-2); // -1 indica retroceder una página en la historia
      }, 300);

      // Limpiar el timeout cuando el componente se desmonta o actualiza
      return () => clearTimeout(timeoutId);
    }
  }, [showAlert, navigate]);

  return (
    <div>
        <div className="fluid color-land">
        <Navbar></Navbar>
        <div className="container land pt-4 pb-4  d-flex" id="landing-p">
          <div className="row w-100">
            <div className="col-12 mt-2 mb-md-3 mb-sm-0"></div>

      <h1>404 - Página no encontrada</h1>
      <p>La página que estás buscando no existe.</p>
    </div>
    </div>
    </div>
    </div>
  );
};

export default NotFound;
