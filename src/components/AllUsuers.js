import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import { Link } from 'react-router-dom';
import { ArrowLeft, X } from 'react-bootstrap-icons';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { API_URL, fetchWithToken } from '../utils/api';
import { showNotification } from '../utils/utils';
import { isUserAdmin } from '../utils/auth';
import Swal from 'sweetalert2';
import UserAvatar from '../components/shared/UserAvatar';
import { Tag } from 'primereact/tag';

const AllUsuers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [usuariosAsignables, setUsuariosAsignables] = useState([]);
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const filteredUsers = users.filter(
    (user) =>
      user.Nombre.toLowerCase().includes(search.toLowerCase()) ||
      user.Apellido_pat.toLowerCase().includes(search.toLowerCase())
  );
  const isAdmin = isUserAdmin();

  const fetchUsuarios = async () => {
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espera un momento',
      allowOutsideClick: false,
    });
    Swal.showLoading();
    try {
      const url = isAdmin ? `${API_URL}/allUsers` : `${API_URL}/usuariosPorRol`;

      const response = await fetchWithToken(url, {
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

      const { users, usuariosAsignables } = await response.json();
      console.log('Usuarios: ', users);
      if (users.length === 0) {
        return showNotification('info', 'No hay usuarios displonibles.', 'UDA');
      }
      setUsers(users);
      setUsuariosAsignables(
        usuariosAsignables.map((user) => ({
          label: `${user.Nombre} ${user.Apellido_pat}`,
          value: user.idUsuario,
        }))
      );
    } catch (error) {
      console.error(error);
      return showNotification('error', 'Se produjo un error', 'UDA');
    }
  };
  const roleOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'Lider', value: 'lider' },
    { label: 'Gerente', value: 'gerente' },
    { label: 'Coordinador', value: 'coordinador' },
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

  // Manejar el cambio de asignado_a
  const onAsignadoChange = async (user, nuevoAsignado) => {
    const result = await Swal.fire({
      title: 'Confirmar Asignación',
      text: `¿Deseas asignar a ${user.Nombre} ${user.Apellido_pat} a otro usuario?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, asignar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      Swal.showLoading();
      try {
        const response = await fetchWithToken(`${API_URL}/actualizarAsignado`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idUsuario: user.idUsuario,
            asignadoA: nuevoAsignado,
          }),
        });

        if (response.ok) {
          const updatedUsers = users.map((u) =>
            u.idUsuario === user.idUsuario
              ? { ...u, asignado_a: nuevoAsignado }
              : u
          );
          setUsers(updatedUsers);
          Swal.close();
          showNotification(
            'success',
            'Asignado a actualizado correctamente',
            'UDA'
          );
        } else {
          Swal.close();
          showNotification('error', 'Error al actualizar asignado a', 'UDA');
        }
      } catch (error) {
        console.error('Error al actualizar asignado_a:', error);
        showNotification('error', 'Error al actualizar asignado_a', 'UDA');
      }
    }
  };

  // Template para la columna "Asignado a"
  const asignadoBodyTemplate = (rowData) => {
    if (rowData.Rol.toLowerCase() === 'admin') {
      return (
        <span className='text-muted'>
          {rowData.asignado_a || 'No asignado'}
        </span>
      );
    }
    return (
      <Dropdown
        value={rowData.asignado_a}
        options={usuariosAsignables}
        onChange={(e) => onAsignadoChange(rowData, e.value)}
        placeholder='Seleccionar usuario'
        optionLabel='label'
        style={{ maxWidth: '9rem', minWidth: '9rem' }}
      />
    );
  };

  const userBodyTemplate = (rowData) => {
    return (
      <div className='d-flex align-items-center gap-2'>
        <UserAvatar
          image={rowData.Imagen}
          firstName={rowData.Nombre}
          lastName={rowData.Apellido_pat}
        />
        <span className='font-semibold'>
          {rowData.Nombre} {rowData.Apellido_pat}
        </span>
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
        style={{ maxWidth: '9rem', minWidth: '9rem' }}
      />
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.Activo ? 'Activo' : 'Inactivo'}
        severity={rowData.Activo ? 'success' : 'danger'}
        className='p-mr-2'
      />
    );
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
            <div className='col-12 px-0 px-md-5 mb-4 mb-md-0 d-flex justify-content-between'>
              <div className='row w-100'>
                {/* <div className='col-md-4 col-12 centrar'>
                  <h4 className='titulo-cambaceo text-start  p-0 p-sm-4'>
                    Usuarios
                  </h4>
                </div>
                <div className='col-md-8 col-12 centrar'>
                  <div className='row w-100'>
                    <div className='col-md-12 d-flex justify-content-between'>
                      <div className='input-wrapper'>
                        <input
                          type='text'
                          className='form-control'
                          placeholder='Buscar por Nombre'
                          aria-label='Buscar'
                          aria-describedby='basic-addon1'
                          value={search}
                          onChange={handleSearchChange}
                          style={{ width: '15rem' }}
                        />
                        <X
                          className='clear-icon'
                          onClick={() => setSearch('')}
                        />
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className='col-md-12 d-flex justify-content-between'>
                  <div className='col-md-6 col-12 centrar'>
                    <h4 className='titulo-cambaceo text-start  p-0 p-sm-4'>
                      Usuarios
                    </h4>
                  </div>
                  <div className='col-md-6 col-12 d-flex align-items-center justify-content-end'>
                    <div className='input-wrapper' style={{ width: '15rem' }}>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Buscar por Nombre'
                        aria-label='Buscar'
                        aria-describedby='basic-addon1'
                        value={search}
                        onChange={handleSearchChange}
                      />
                      <X className='clear-icon' onClick={() => setSearch('')} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DataTable value={filteredUsers} sortMode='multiple' removableSort>
              <Column
                field='Usuario'
                header='Usuario'
                body={userBodyTemplate}
                sortable
              ></Column>
              <Column field='Correo' header='Correo' sortable></Column>
              <Column field='Telefono' header='Teléfono' sortable></Column>
              <Column
                field='Rol'
                header='Rol'
                body={roleBodyTemplate}
                sortable
              ></Column>
              <Column
                field='Activo'
                header='Estado'
                body={statusBodyTemplate}
                sortable
              ></Column>
              <Column
                field='asignado_a'
                header='Asignado a'
                body={asignadoBodyTemplate}
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
