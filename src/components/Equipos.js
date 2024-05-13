import React, { useRef, useState, useEffect } from 'react';
import Navbar from './navbar';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'react-bootstrap-icons';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useAuthRedirect } from '../useAuthRedirect';
import { API_URL, fetchWithToken } from '../utils/api';
import Usuario_sin_img from '../img/imagen-de-usuario-con-fondo-negro.png';
import { showNotification } from '../utils/utils';

import Swal from 'sweetalert2';

const Equipos = () => {
  useAuthRedirect();
  const navigate = useNavigate();
  const [equipos, setEquipos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRowData, setSelectedRowData] = useState(null);
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredEquipos = equipos.filter((equipo) =>
    equipo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchEquipos = async () => {
    try {
      const response = await fetchWithToken(`${API_URL}/GetEquipos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const equiposData = await response.json();
      setEquipos(equiposData);
    } catch (error) {
      console.error('Error fetching equipos:', error);
    }
  };
  const deleteEquipo = async (equipoId) => {
    try {
      const response = await fetchWithToken(`${API_URL}/DeleteEquipo/${equipoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const newEquipos = equipos.filter(equipo => equipo.id !== equipoId);
        setEquipos(newEquipos);
        showNotification('success', 'Equipo eliminado', 'El equipo fue eliminado correctamente');
      } else {
        throw new Error('Error al eliminar el equipo');
      }
    } catch (error) {
      console.error('Error eliminando el equipo:', error);
      alert('No se pudo eliminar el equipo');
    }
  };
  const optionsMenu = (rowData) => {
    const menuItems = [
      {
        label: 'Editar equipo',
        icon: 'pi pi-pencil',
        command: () => {
          if(selectedRowData) {
            navigate(`/EditarEquipo/${selectedRowData.id}`);
          } else {
            console.error('No se ha seleccionado ningún equipo.');
          }
        },
      },
      {
        label: 'Eliminar equipo',
        icon: 'pi pi-trash',
        command: () => {
          Swal.fire({
            title: '¿Estás seguro?',
            text: 'Una vez eliminado, no podrás recuperar este equipo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
          }).then((result) => {
            if (result.isConfirmed) {
              deleteEquipo(rowData.id);
            }
          });


        },
      },
    ];
  
    return (
      <div className='p-d-flex p-justify-center'>
      <Button
        icon='pi pi-bars'
        className='p-button-rounded p-button-text'
        onClick={(e) => showMenu(e, rowData)}
      />
      <Menu model={menuItems} popup ref={menu} />
    </div>
    );
  };
  const imageBodyTemplate = (rowData) => {
    return (
      <div className='avatars'>
        {rowData.imagenes.map((imgUrl, index) => (
          <img
            key={index}
            src={imgUrl}
            onError={(e) => (e.target.src = Usuario_sin_img)}
            alt='member'
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              margin: '2px',
            }}
          />
        ))}
      </div>
    );
  };

  // const optionsMenu = (rowData) => {
  //   return (
      // <div className='p-d-flex p-justify-center'>
      //   <Button
      //     icon='pi pi-bars'
      //     className='p-button-rounded p-button-text'
      //     onClick={(e) => showMenu(e, rowData)}
      //   />
      //   <Menu model={menuItems} popup ref={menu} />
      // </div>
  //   );
  // };

  const showMenu = (event, rowData) => {
    setSelectedRowData(rowData);
    setMenuTarget(event.currentTarget);
    menu.current.toggle(event); 
  };
  

  const menu = useRef(null);
  const [menuTarget, setMenuTarget] = useState(null);
  useEffect(() => {
    fetchEquipos();
  }, []);

  return (
    <div className='fluid'>
      <Navbar></Navbar>
      <div className='Colab'>
        <div className='container-fluid px-4'>
          <div className='row table_space mt-4'>
            <div className='col-md-12 d-flex justify-content-center align-items-center mb-3'>
              <Link to='/land'>
                <ArrowLeft className='ml-4 regreso' />
                <span id='indicador'>Menu Principal</span>
              </Link>
            </div>
          </div>
          <div
            className='container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4'
            id='contenedor'
          >
            <div className='row align-items-center'>
              <div className='col-md-6'>
                <h6
                  style={{
                    textAlign: 'left',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    fontSize: '32px',
                    color: '#172126',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Equipos
                </h6>
              </div>
              <div className='col-md-6'>
                <div className='text-right'>
                  <div style={{ display: 'inline-block' }}>
                    <div className='row'>
                      <div className='col-md-6'>
                        <div
                          className='p-input-icon-left'
                          style={{
                            display: 'inline-block',
                            marginLeft: '2rem',
                          }}
                        >
                          <i className='pi pi-search' />
                          <InputText
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder='Buscar'
                          />
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <Link to='/crearEquipo'>
                        <Button
                          label='Crear Equipo'
                          icon='pi pi-plus'
                          severity='Danger'
                          style={{ marginLeft: '2rem' }}
                        />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-4'>
              <DataTable
                value={filteredEquipos}
                rows={5}
                emptyMessage='No hay equipos disponibles.'
              >
                <Column field='nombre' header='Nombre' />
                <Column field='miembros' header='# Usuarios' />
                <Column header='Imágenes' body={imageBodyTemplate} />
                <Column
                  header=''
                  body={optionsMenu}
                  style={{ textAlign: 'center', width: '8em' }}
                />
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Equipos;
