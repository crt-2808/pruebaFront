import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'react-bootstrap-icons';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { API_URL, fetchWithToken } from '../utils/api';
import { showNotification } from '../utils/utils';
import { isUserAdmin } from '../utils/auth';
import Usuario_sin_img from '../img/imagen-de-usuario-con-fondo-negro.png';
import Swal from 'sweetalert2';

const AllUsuers = () => {
  const [users, setUsers] = useState([]);
  const fetchUsuarios = async () => {
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espera un momento',
      allowOutsideClick: false,
    });
    Swal.showLoading();
    try {
      const response = await fetchWithToken(`${API_URL}/allUsers`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      Swal.close();
      if (!response) {
        // Si fetchWithToken redirige al usuario, no continuamos el flujo
        return;
      }
      if (!response.ok) {
        console.log('Error: ', response);
        return showNotification('error', 'Se produjo un error', 'UDA');
      }

      const data = await response.json();
      console.log('Usuarios: ', data);
      if (data.length === 0) {
        return showNotification('info', 'No hay usuarios displonibles.', 'UDA');
      }
      setUsers(data);
    } catch (error) {
      console.error(error);
      return showNotification('error', 'Se produjo un error', 'UDA');
    }
  };
  const roleOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'Lider', value: 'lider' },
    { label: 'Colaborador', value: 'colaborador' },
  ];

  useEffect(() => {
    // Lógica para obtener los usuarios
    fetchUsuarios();
  }, []);
  const onRoleChange = async (user, newRole) => {
    if (isUserAdmin() && user.Rol === 'admin') {
      showNotification(
        'error',
        'No puedes cambiar el rol de otro administrador',
        'UDA'
      );
      return;
    }
    const result = await Swal.fire({
      title: 'Confirmar Cambio',
      text: `¿Estás seguro que deseas cambiar el rol de ${user.Nombre} ${user.Apellido_pat} a ${newRole}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar!',
    });
    if (result.isConfirmed) {
      Swal.showLoading();
      try {
        // Llamada a la API para cambiar el rol
        const response = await fetchWithToken(
          `${API_URL}/putRolUsuario/${user.idUsuario}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Rol: newRole }),
          }
        );

        if (response.ok) {
          // Actualizar el estado para reflejar el cambio
          const updatedUsers = users.map((u) =>
            u.idUsuario === user.idUsuario ? { ...u, Rol: newRole } : u
          );
          setUsers(updatedUsers);
          Swal.close();
          showNotification('success', 'Rol actualizado correctamente', 'UDA');
        } else {
          Swal.close();
          // Manejo de errores de la respuesta
          showNotification('error', 'Error al actualizar el rol', 'UDA');
        }
      } catch (error) {
        console.error('Error al cambiar el rol:', error);
        showNotification('error', 'Error al cambiar el rol', 'UDA');
      }
    }
  };
  //   const onStatusChange = (user, newStatus) => {
  // Lógica para cambiar el estado del usuario
  // ...
  //   };

  //   const deactivateUser = (user) => {
  // Lógica para dar de baja al usuario
  // ...
  //   };
  const imageBodyTemplate = (rowData) => {
    const handleImageError = (e) => {
      e.target.src = Usuario_sin_img;
    };
    const imageSrc =
      rowData.Imagen && rowData.Imagen !== 'src'
        ? rowData.Imagen
        : Usuario_sin_img;
    return (
      <img
        src={imageSrc}
        alt={rowData.Nombre}
        onError={handleImageError}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          aspectRatio: '1/1',
          objectFit: 'cover',
        }}
      />
    );
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <div>
        <span>{rowData.Nombre + ' ' + rowData.Apellido_pat}</span>
      </div>
    );
  };
  const roleBodyTemplate = (rowData) => {
    const isDisabled = isUserAdmin() && rowData.Rol === 'admin';
    return (
      <Dropdown
        value={rowData.Rol}
        options={roleOptions}
        onChange={(e) => onRoleChange(rowData, e.value)}
        placeholder='Seleccionar Rol'
        optionLabel='label'
        disabled={isDisabled}
      />
    );
  };

  const statusBodyTemplate = (rowData) => {
    const statusLabel =
      rowData.Activo === null
        ? 'Indefinido'
        : rowData.Activo
        ? 'Activo'
        : 'Inactivo';
    return <span>{statusLabel}</span>;
  };

  //   const actionsBodyTemplate = (rowData) => {
  //     return (
  //       <Button
  //         label='Dar de Baja'
  //         className='p-button-danger'
  //         style={{ minWidth: '100px' }}
  //         onClick={() => deactivateUser(rowData)}
  //       />
  //     );
  //   };
  return (
    <div className='fluid'>
      <Navbar style={{ backgroundColor: '##F8F9FA' }}></Navbar>

      <div style={{ backgroundColor: '#F1F5F8' }}>
        <div
          style={{
            paddingTop: '10px',
            paddingBottom: '10px',
            backgroundColor: '#F1F5F8',
          }}
        >
          <Link to='/Land'>
            <ArrowLeft className='ml-4 regreso' />
            <span style={{ marginBottom: '100px' }} id='indicador'>
              Menu Principal
            </span>
          </Link>
        </div>
      </div>
      <div
        className='py-md-4 py-5 container-fluid d-flex align-items-center justify-content-center'
        style={{ backgroundColor: '#F1F5F8', minHeight: '97vh' }}
      >
        <div className='w-100 text-center'>
          <div className='row'>
            <h4 className='titulo-cambaceo px-0 px-md-5'>Usuarios</h4>
            <DataTable value={users}>
              <Column
                field='Imagen'
                header='Imagen'
                body={imageBodyTemplate}
              ></Column>
              <Column
                field='Nombre'
                header='Nombre'
                body={nameBodyTemplate}
              ></Column>
              <Column field='Correo' header='Correo'></Column>
              <Column field='Telefono' header='Teléfono'></Column>
              <Column field='Rol' header='Rol' body={roleBodyTemplate}></Column>
              <Column
                field='Activo'
                header='Estado'
                body={statusBodyTemplate}
              ></Column>
              {/* <Column body={actionsBodyTemplate}></Column> */}
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsuers;
