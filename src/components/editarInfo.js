import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'react-bootstrap-icons';
import Swal from 'sweetalert2';
import Navbar from './navbar';
import { fetchWithToken, API_URL } from '../utils/api.js';
import { RiUserFill } from 'react-icons/ri'; // Importa el icono de usuario

const EditarInfo = () => {
  const [usuario, setUsuario] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  const navigate = useNavigate();
  const [imagenUsuario, setImagenUsuario] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetchWithToken(`${API_URL}/InformacionUsuario`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setImagenUsuario(data.Imagen || '');
      setUsuario(data);
      if (data) {
        setValue('Nombre', data.Nombre || '');
        setValue('Apellido_pat', data.Apellido_pat || '');
        setValue('Apellido_mat', data.Apellido_mat || '');
        setValue('Telefono', data.Telefono || '');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setImagenUsuario(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await fetchWithToken(
        `${API_URL}/actualizarInformacion`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();

      // Actualizar el estado local del usuario con los datos actualizados
      sessionStorage.setItem(
        'usuario',
        JSON.stringify(responseData.updatedUserData)
      ); // Almacena los datos del usuario como una cadena JSON

      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: responseData.message,
      }).then(() => {
        navigate('/land');
      });
    } catch (error) {
      console.error('Error updating user information:', error);
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Ocurrió un error al actualizar la información del colaborador',
      });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCambiarImagenClick = () => {
    document.getElementById('fileInput').click();
  };

  return (
    <div className='fluid'>
      <Navbar style={{ backgroundColor: '##F8F9FA' }} />
      <div style={{ backgroundColor: '#F1F5F8' }}>
        <div
          style={{
            paddingTop: '10px',
            paddingBottom: '10px',
            backgroundColor: '#F1F5F8',
          }}
        >
          <Link to='/land'>
            <ArrowLeft className='ml-4 regreso' />
            <span style={{ marginBottom: '100px' }} id='indicador'>
              Menu Principal
            </span>
          </Link>
        </div>
      </div>
      <div
        className='centro-block'
        style={{
          backgroundColor: '#F1F5F8',
          minHeight: '87vh',
        }}
      >
        <div
          className='row'
          style={{
            marginLeft: '35px',
            marginBottom: '-50px',
            marginRight: '0px',
          }}
        >
          <h2 className='titulo-cambaceo px-0 px-md-5'>Editar Mi Perfil</h2>
        </div>
        <div className='editar-info'>
          <div
            className='container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-5 mt-md-4'
            id='contenedor-cambaceo'
          >
            <div className='row'>
              <div className='col-md-4'>
                <div className='icono-usuario'>
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt='Vista previa de la imagen'
                      className='img-fluid'
                    />
                  ) : imagenUsuario ? (
                    <img
                      src={imagenUsuario}
                      alt='Imagen de perfil'
                      className='img-fluid'
                    />
                  ) : (
                    <RiUserFill size={100} color='#CCCCCC' />
                  )}
                  <input
                    type='file'
                    id='fileInput'
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept='image/*'
                  />
                </div>
                <button
                  className='btn btn-primary mt-2'
                  onClick={handleCambiarImagenClick}
                >
                  Cambiar imagen
                </button>
              </div>

              <div className='col-md-8'>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className='form-group'>
                    <label htmlFor='firstName'>Nombre(s):</label>
                    <input
                      type='text'
                      id='firstName'
                      className='form-control'
                      {...register('Nombre', {
                        required: 'El nombre es obligatorio',
                      })}
                    />
                    {errors.firstName && (
                      <p className='text-danger'>{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className='form-group'>
                    <label htmlFor='lastName'>Apellido Paterno:</label>
                    <input
                      type='text'
                      id='lastName'
                      className='form-control'
                      {...register('Apellido_pat', {
                        required: 'El apellido paterno es obligatorio',
                      })}
                    />
                    {errors.lastName && (
                      <p className='text-danger'>{errors.lastName.message}</p>
                    )}
                  </div>
                  <div className='form-group'>
                    <label htmlFor='middleName'>Apellido Materno:</label>
                    <input
                      type='text'
                      id='middleName'
                      className='form-control'
                      {...register('Apellido_mat', {
                        required: 'El apellido materno es obligatorio',
                      })}
                    />
                    {errors.middleName && (
                      <p className='text-danger'>{errors.middleName.message}</p>
                    )}
                  </div>
                  <div className='form-group'>
                    <label htmlFor='telefono'>Teléfono:</label>
                    <input
                      type='text'
                      id='telefono'
                      className='form-control'
                      {...register('Telefono')}
                    />
                    {errors.telefono && (
                      <p className='text-danger'>
                        Debe ser un número de teléfono válido
                      </p>
                    )}
                  </div>
                  <button
                    type='submit'
                    className='btn btn-primary'
                    style={{ marginTop: '10px' }}
                  >
                    Guardar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarInfo;
