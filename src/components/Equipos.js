import React, { useRef, useState } from "react";
import Navbar from "./navbar";
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "react-bootstrap-icons";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import Diario from "../img/Diario.svg";
import Semanal from "../img/Semanal.svg";
import Seguimiento from "../img/Seguimiento.svg";
import { useAuthRedirect } from "../useAuthRedirect";

const Equipos = () => {
  useAuthRedirect();

  const menuItems = [
    {
      label: 'Añadir usuario',
      icon: 'pi pi-user-plus',
      command: () => {
        console.log('Añadir usuario');
      }
    },
    {
      label: 'Editar equipo',
      icon: 'pi pi-pencil',
      command: () => {
        console.log('Editar equipo');
      }
    },
    {
      label: 'Eliminar equipo',
      icon: 'pi pi-trash',
      command: () => {
        console.log('Eliminar equipo');
      }
    }
  ];

  const optionsMenu = (rowData) => {
    return (
      <div className="p-d-flex p-justify-center">
        <Button icon="pi pi-bars" className="p-button-rounded p-button-text" onClick={(e) => showMenu(e, rowData)} />
        <Menu model={menuItems} popup ref={menu} />
      </div>
    );
  };

  const showMenu = (event, rowData) => {
    setMenuTarget(event.currentTarget);
    menu.current.show(event);
  };

  const data = [
    { name: 'Equipo 1', members: 5 },
    { name: 'Equipo 2', members: 5 },
    { name: 'Equipo 3', members: 5 },
    { name: 'Equipo 4', members: 5 },
    { name: 'Equipo 5', members: 5 }
  ];

  const menu = useRef(null);
  const [menuTarget, setMenuTarget] = useState(null);

return(
    <div className="fluid">
      <Navbar></Navbar>
      <div className="Colab">
        <div className="container-fluid px-4">
          <div className="row table_space mt-4">
            <div className="col-md-12 d-flex justify-content-center align-items-center mb-3">
              <Link to="/land">
                <ArrowLeft className="ml-4 regreso" />
                <span id="indicador">Menu Principal</span>
              </Link>
            </div>
          </div>
          <div
            className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4"
            id="contenedor"
          >
            <div className="row align-items-center">
              <div className="col-md-6">
                <h6 style={{ textAlign: 'left', fontStyle: 'normal', fontWeight: 700, fontSize: '32px', color: '#172126', whiteSpace: 'nowrap' }}>Equipos</h6>
              </div>
              <div className="col-md-6">
                <div className="text-right">
                  <div style={{ display: "inline-block" }}>
                    <div className="p-input-icon-left" style={{ display: "inline-block", marginLeft: "2rem" }}>
                      <i className="pi pi-search" />
                      <InputText placeholder="Buscar" />
                    </div>
                  </div>
                  <Button  label="Crear Equipo"  icon="pi pi-plus" severity="Danger" style={{ marginLeft: '2rem' } } />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <DataTable value={data} paginator rows={5}>
                <Column field="name" header="Nombre" />
                <Column field="members" header="# Usuarios" />
                <Column header="" body={optionsMenu} style={{ textAlign: 'center', width: '8em' }} />
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Equipos;


