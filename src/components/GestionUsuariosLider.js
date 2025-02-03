import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { Link } from 'react-router-dom';
import Navbar from './navbar';
import { ArrowLeft } from 'react-bootstrap-icons';
import UserAvatar from '../components/shared/UserAvatar';

import { API_URL, fetchWithToken } from '../utils/api';
import { showNotification } from '../utils/utils';

const GestionUsuariosLider = () => {
  const [users, setUsers] = useState([]);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetchWithToken(`${API_URL}/usuariosLider`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.usuarios);
      console.log(data.usuarios);
      console.log(data);
      console.log(data.opcionesAsignacion);
      setAssignableUsers(data.opcionesAsignacion);
    } catch (error) {
      showNotification('error', 'Error loading users', 'UDA');
    } finally {
      setLoading(false);
    }
  };

  const onAssignUser = async (userId, newAssigneeId) => {
    try {
      const response = await fetchWithToken(
        `${API_URL}/reasignarUsuarioLider`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idUsuario: userId,
            asignadoA: newAssigneeId,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to assign user');

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.idUsuario === userId
            ? { ...user, asignado_a: newAssigneeId }
            : user
        )
      );
      showNotification('success', 'Usuario asignado correctamente', 'UDA');
    } catch (error) {
      showNotification('error', 'Error al asignar usuario', 'UDA');
    }
  };

  const userTemplate = (rowData) => (
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

  const roleTemplate = (rowData) => (
    <span
      className='p-2 rounded text-center'
      style={{
        ...getRoleStyle(rowData.Rol),
        display: 'inline-block',
        minWidth: '110px',
        borderRadius: '10px',
        fontWeight: 'bold',
        textTransform: 'capitalize',
      }}
    >
      {rowData.Rol}
    </span>
  );

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.Activo ? 'Activo' : 'Inactivo'}
        severity={rowData.Activo ? 'success' : 'danger'}
        className='p-mr-2'
      />
    );
  };

  const assigneeTemplate = (rowData) => {
    // Buscar el nombre del usuario asignado
    const assignedUser = assignableUsers.find(
      (user) => user.idUsuario === rowData.asignado_a
    );

    // Si el usuario es Admin o Líder, solo mostrar el nombre sin dropdown
    if (
      rowData.Rol.toLowerCase() === 'admin' ||
      rowData.Rol.toLowerCase() === 'líder'
    ) {
      return (
        <span className='text-muted'>
          {assignedUser?.label || 'No asignado'}
        </span>
      );
    }

    // Mostrar dropdown para otros roles
    return (
      <Dropdown
        value={rowData.asignado_a}
        options={assignableUsers}
        onChange={(e) => onAssignUser(rowData.idUsuario, e.value)}
        optionLabel='label'
        optionValue='idUsuario'
        placeholder='Seleccionar Asignado'
        className='w-full md:w-14rem'
        style={{ maxWidth: '9rem', minWidth: '9rem' }}
      />
    );
  };

  const getRoleStyle = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return { backgroundColor: '#e74c3c', color: 'white' }; // Rojo fuerte
      case 'gerente':
        return { backgroundColor: '#f1c40f', color: 'black' }; // Amarillo
      case 'coordinador':
        return { backgroundColor: '#3498db', color: 'white' }; // Azul intenso
      case 'líder':
        return { backgroundColor: '#2ecc71', color: 'white' }; // Verde
      case 'colaborador':
        return { backgroundColor: '#9b59b6', color: 'white' }; // Morado 💜
      case 'supervisor':
        return { backgroundColor: '#e91e63', color: 'white' }; // Rosa fuerte 💗
      case 'analista':
        return { backgroundColor: '#1abc9c', color: 'white' }; // Verde azulado 🌊
      case 'operador':
        return { backgroundColor: '#e67e22', color: 'white' }; // Naranja 🟠
      case 'soporte':
        return { backgroundColor: '#607d8b', color: 'white' }; // Azul grisáceo ⚙️
      default:
        return { backgroundColor: '#34495e', color: 'white' }; // Azul oscuro por defecto
    }
  };

  const header = (
    <div className='d-flex flex-wrap gap-2 align-items-center justify-content-between'>
      <h4 className='m-0 text-white'>Gestionar usuarios</h4>
      <span className='p-input-icon-left'>
        <i className='pi pi-search' />
        <InputText
          type='search'
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder='Buscar...'
          className='p-inputtext-sm'
        />
      </span>
    </div>
  );

  return (
    <div className='fluid'>
      <Navbar></Navbar>
      <Link to='/land'>
        <ArrowLeft className='ml-4 regreso' />
        <span id='indicador'>Inicio</span>
      </Link>

      <div className='col-12 min-vh-90 todo pt-3'>
        <div
          className='container mt-sm-5 mb-4 p-5 mt-md-1'
          id='contenedor-land'
        >
          <div className='row'>
            <div className='col-md-12'>
              <div className='row no-padding'>
                <div className='col-12'>
                  <div className='row no-padding pl-0 pr-0'>
                    <div className='container-fluid'>
                      <DataTable
                        value={users}
                        selection={selectedUsers}
                        onSelectionChange={(e) => setSelectedUsers(e.value)}
                        dataKey='idUsuario'
                        paginator
                        rows={8}
                        rowsPerPageOptions={[8, 10, 25]}
                        paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
                        currentPageReportTemplate='Elementos {first} a {last} de {totalRecords} usuarios'
                        globalFilter={globalFilter}
                        header={header}
                        loading={loading}
                        emptyMessage='No hay usuarios disponibles.'
                        className='p-datatable-sm rounded'
                        // scrollHeight='calc(100vh - 200px)'

                        sortMode='multiple'
                        removableSort
                        scrollable
                        scrollHeight='570px'
                        tableStyle={{ borderRadius: '15px' }}
                      >
                        <Column
                          field='usuario'
                          header='Usuario'
                          body={userTemplate}
                          sortable
                          style={{ minWidth: '14rem' }}
                        />
                        <Column
                          field='Correo'
                          header='Email'
                          sortable
                          style={{ minWidth: '14rem' }}
                        />
                        <Column
                          field='Telefono'
                          header='Teléfono'
                          sortable
                          style={{ minWidth: '10rem' }}
                        />
                        <Column
                          field='Rol'
                          header='Rol'
                          body={roleTemplate}
                          sortable
                          style={{ minWidth: '8rem' }}
                        />
                        <Column
                          field='Activo'
                          header='Estado'
                          body={statusBodyTemplate}
                          sortable
                          style={{ minWidth: '2rem' }}
                        />
                        <Column
                          field='asignado_a'
                          header='Asignado a'
                          body={assigneeTemplate}
                          style={{ maxWidth: '10rem' }}
                        />
                      </DataTable>
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

export default GestionUsuariosLider;
