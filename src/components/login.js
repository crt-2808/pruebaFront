import React, { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import img_ejemplo from '../img/undraw_Blog_post_re_fy5x.png';
import Navbar from './navbar';
// import { gapi } from 'gapi-script';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../userProvider';
import { useAuthRedirect } from '../useAuthRedirect';
import { API_URL } from '../utils/api';
import { Toast } from 'primereact/toast';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { showNotification } from '../utils/utils';
import { SessionManager } from '../utils/sessionManager';
const mostrarMensajeUsuarioNoRegistrado = () => {
  Swal.fire({
    title: 'Usuario No Registrado',
    text: 'Tu cuenta de Google no está registrada en nuestra aplicación. Por favor, contacta con el equipo de soporte.',
    icon: 'error',
    confirmButtonText: 'Ok',
  });
};
function Login() {
  useAuthRedirect();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const { toggleUser, usuario, toggleUserBlocked } = useUserContext();

  useEffect(() => {
    if (SessionManager.isSessionValid()) {
      navigate('/land');
    }
  }, [navigate]);

  const onSuccess = async (credentialResponse) => {
    try {
      // Decodificar el token JWT
      const decoded = jwtDecode(credentialResponse.credential);
      const { email, name, picture, family_name, given_name } = decoded;

      console.log('Usuario Decodificado:', decoded);

      // Llamada al backend para autenticar al usuario
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ Correo: email }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.message === 'El usuario no existe.') {
          mostrarMensajeUsuarioNoRegistrado();
          toggleUserBlocked(true);
          return;
        }
        throw new Error(data.message || 'Error en la autenticación');
      }

      // Manejo exitoso
      const { token, role, vistoTour } = await response.json();
      console.log('Autenticación exitosa:', { token, role });

      const userData = {
        name,
        email,
        imageUrl: picture,
        givenName: given_name,
        familyName: family_name,
      };

      // Set session data
      SessionManager.setSession(token, role, userData, vistoTour);
      // Actualizar el contexto del usuario
      toggleUser(userData);
      toggleUserBlocked(false);

      // Redirigir según el rol del usuario
      navigate('/land', { replace: true });
    } catch (error) {
      console.error('Error en la autenticación:', error);
      showNotification(
        'error',
        'Error en la autenticación. Por favor, intenta de nuevo.'
      );
    }
  };

  const onFailure = (error) => {
    console.error('Error en el inicio de sesión:', error);
    showNotification(
      'error',
      'No se pudo iniciar sesión con Google. Por favor, intenta de nuevo.'
    );
  };

  // const logOut = () => {
  //   sessionStorage.removeItem('jwtToken');
  //   toggleUser(null);
  //   sessionStorage.removeItem('usuario');
  // };
  useEffect(() => {
    if (usuario) {
      navigate('/land');
    }
  }, [usuario, navigate]);
  return (
    <div className='fluid'>
      <Navbar></Navbar>
      <Toast
        position='top-right'
        baseZIndex={1000}
        visible={showToast.toString()}
        severity='warn'
      >
        Tu sesión ha expirado. Por favor, vuelve a entrar o actualiza la página.
      </Toast>

      <div className='container fluid'>
        <div className='content'>
          <div className='container'>
            <div className='row land'>
              <div className='col-md-6'>
                <img
                  src={img_ejemplo}
                  alt='svg_ejemplo'
                  className='img-fluid'
                />
              </div>
              <div className='col-md-6 contents'>
                <div className='row justify-content-center espacio'>
                  <div className='col-md-8'>
                    <div className='mb-4'>
                      <h3>Ingresa tus credenciales</h3>
                    </div>

                    <div className='container-fluid fluid my-5 d-flex  align-items-center justify-content-center'>
                      {usuario ? (
                        <div>Dentro</div>
                      ) : (
                        <div className='col-12 d-flex justify-content-center align-items-center'>
                          <div className='google-login-scale'>
                            <GoogleLogin
                              onSuccess={onSuccess}
                              onFailure={onFailure}
                            />
                          </div>
                        </div>
                      )}
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
}

// rafce

export default Login;
