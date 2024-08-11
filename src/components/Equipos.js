import React, { useRef, useState, useEffect } from "react";
import Navbar from "./navbar";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useAuthRedirect } from "../useAuthRedirect";
import { API_URL, fetchWithToken } from "../utils/api";
import Usuario_sin_img from "../img/imagen-de-usuario-con-fondo-negro.png";
import { showNotification } from "../utils/utils";
import { isUserAdmin, isUserLider } from "../utils/auth";
import { Avatar } from "primereact/avatar";
import { Dialog } from "primereact/dialog";

import Swal from "sweetalert2";

const Equipos = () => {
  useAuthRedirect();
  const isAdmin = isUserAdmin();
  const isLider = isUserLider();
  const navigate = useNavigate();
  const [equipos, setEquipos] = useState([]);
  const [gerentes, setGerentes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalEquipoData, setModalEquipoData] = useState(null);
  const [equipoMembers, setEquipoMembers] = useState([]);
  const [membersData, setMembersData] = useState([]);
  const [showGerentes, setShowGerentes] = useState(true);
  const [showCoordinadores, setShowCoordinadores] = useState(true);
  const [showAsesores, setShowAsesores] = useState(true);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredEquipos = equipos.filter((equipo) =>
    equipo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchEquipos = async () => {
    try {
      const response = await fetchWithToken(`${API_URL}/GetEquipos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const equiposData = await response.json();
      setEquipos(equiposData);
      console.log("Equipos:", equiposData);
    } catch (error) {
      console.error("Error fetching equipos:", error);
    }
  };

  const fetchGerentes = async () => {
    try {
      const response = await fetchWithToken(`${API_URL}/GetGerentes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const gerentesData = await response.json();
      // Agrega el campo nombreGerente concatenando Nombre, Apellido_pat, Apellido_mat
      const gerentesWithFullName = gerentesData.map((gerente) => ({
        ...gerente,
        nombreGerente: `${gerente.Nombre} ${gerente.Apellido_pat} ${gerente.Apellido_mat}`,
      }));
      setGerentes(gerentesWithFullName);
      console.log("Estos son los gerentes", gerentesWithFullName);
    } catch (error) {
      console.error("No encontre gerentes", error);
    }
  };

  const fetchEquipoMembers = async (equipoId) => {
    try {
      const response = await fetchWithToken(
        `${API_URL}/equipos/${equipoId}/members`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const membersData = await response.json();
      setEquipoMembers(membersData);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };
  const deleteEquipo = async (equipoId) => {
    try {
      console.log("Equipo a eliminar:", equipoId); // Agregar console.log del equipo seleccionado
      const response = await fetchWithToken(
        `${API_URL}/DeleteEquipo/${equipoId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const newEquipos = equipos.filter((equipo) => equipo.id !== equipoId);
        setEquipos(newEquipos);
        showNotification(
          "success",
          "Equipo eliminado",
          "El equipo fue eliminado correctamente"
        );
      } else {
        throw new Error("Error al eliminar el equipo");
      }
    } catch (error) {
      console.error("Error eliminando el equipo:", error);
      alert("No se pudo eliminar el equipo");
    }
  };

  const optionsMenu = (rowData) => {
    const menuItems = [
      {
        label: "Editar equipo",
        icon: "pi pi-pencil",
        command: () => {
          if (selectedRowData) {
            navigate(`/EditarEquipo/${selectedRowData.id}`);
          } else {
            console.error("No se ha seleccionado ningún equipo.");
          }
        },
      },
      {
        label: "Eliminar equipo",
        icon: "pi pi-trash",
        command: () => {
          Swal.fire({
            title: "¿Estás seguro?",
            text: "Una vez eliminado, no podrás recuperar este equipo",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
          }).then((result) => {
            if (result.isConfirmed) {
              deleteEquipo(selectedRowData.id);
            }
          });
        },
      },
    ];

    return (
      <div className="p-d-flex p-justify-center">
        <Button
          icon="pi pi-bars"
          className="p-button-rounded p-button-text"
          onClick={(e) => showMenu(e, rowData)}
        />
        <Menu model={menuItems} popup ref={menu} />
      </div>
    );
  };
  
  const showMenu = (event, rowData) => {
    setSelectedRowData(rowData);
    setMenuTarget(event.currentTarget);
    menu.current.toggle(event);
  };
  const handleViewEquipo = (equipo) => {
    setModalEquipoData(equipo);
    fetchEquipoMembers(equipo.id);
    setIsModalVisible(true);
  };
  const renderModal = () => {
    return (
      <Dialog
        header="Detalles del Equipo"
        visible={isModalVisible}
        onHide={() => setIsModalVisible(false)}
      >
        {modalEquipoData && (
          <div>
            <h2>{modalEquipoData.nombre}</h2>
            <p>Miembros:</p>
            <ul>
              {equipoMembers.map((member, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                    minWidth: "450px",
                  }}
                >
                  <Avatar
                    image={member.Imagen || Usuario_sin_img}
                    onImageError={(e) => (e.target.src = Usuario_sin_img)}
                    shape="circle"
                    size="large"
                  />
                  <span
                    className="cropped-text"
                    style={{
                      marginLeft: "10px",
                      fontWeight: "bold",
                      maxWidth: "200px",
                      marginRight: "auto",
                    }}
                  >{`${member.Nombre} ${member.Apellido_pat}`}</span>
                  <span style={{ fontStyle: "italic" }}>{member.Rol}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Dialog>
    );
  };
  const viewButtonTemplate = (rowData) => {
    return (
      <Button label="Ver equipo" onClick={() => handleViewEquipo(rowData)} />
    );
  };

  const menu = useRef(null);
  const [menuTarget, setMenuTarget] = useState(null);

  const fetchUsuarios = async () => {
    try {
      const url = `${API_URL}/usuariosPorRol`;
      const response = await fetchWithToken(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setMembersData(data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  useEffect(() => {
    fetchEquipos();
    fetchGerentes();
    fetchUsuarios();
    console.log(membersData);
  }, []);


  const filteredMembers = membersData.filter((member) =>
    `${member.Nombre} ${member.Apellido_pat} ${member.Apellido_mat}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const groupedMembers = filteredMembers.reduce(
    (acc, member) => {
      if (member.Rol === "coordinador") {
        acc.coordinadores.push(member);
      } else if (member.Rol === "colaborador") {
        acc.asesores.push(member);
      }
      return acc;
    },
    { coordinadores: [], asesores: [] }
  );

  const toggleGerentes = () => setShowGerentes(!showGerentes);
  const toggleCoordinadores = () => setShowCoordinadores(!showCoordinadores);
  const toggleAsesores = () => setShowAsesores(!showAsesores);


  return (
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
                <h6
                  style={{
                    textAlign: "left",
                    fontStyle: "normal",
                    fontWeight: 700,
                    fontSize: "32px",
                    color: "#172126",
                    whiteSpace: "nowrap",
                  }}
                >
                  Equipos
                </h6>
              </div>
              <div className="col-md-6 col-12">
                <div className="text-right">
                  <div style={{ display: "inline-block" }}>
                    <div className="row">
                      <div className="col-md-6 col-6">
                        <div
                          className="p-input-icon-left ml-2 w-100"
                          style={{
                            display: "inline-block",
                          }}
                        >
                          <i className="pi pi-search" />
                          <InputText
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Buscar"
                            className="w-100"
                          />
                        </div>
                      </div>
                      <div className="col-md-6 col-6">
                        <Link to="/crearEquipo">
                          <Button
                            className="d-none d-sm-inline-flex" // Ocultar en tamaños pequeños
                            label="Crear Equipo"
                            icon="pi pi-plus"
                            severity="Danger"
                            style={{ marginLeft: "2rem" }}
                          />
                          <Button
                            className="d-inline-flex d-sm-none" // Mostrar solo en tamaños pequeños
                            icon="pi pi-plus"
                            severity="Danger"
                            style={{ marginLeft: "2rem" }}
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              {isLider && (
                <div className="mt-4">
                  <h3 onClick={toggleGerentes} className="title">
                    Gerentes
                    <Button
                      icon={
                        showGerentes ? "pi pi-angle-up" : "pi pi-angle-down"
                      }
                      className="p-button-rounded p-button-text"
                    />
                  </h3>
                  <hr />
                  {showGerentes && (
                    <div className="gerentes-container">
                      {gerentes.length > 0 ? (
                        gerentes.map((gerente) => (
                          <div
                            key={gerente.idUsuario}
                            className="p-card p-component"
                            onClick={() =>
                              navigate(`/EquipoGerente/${gerente.idUsuario}`, {
                                state: { gerente },
                              })
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <div
                              className="p-card-body"
                              style={{ textAlign: "center" }}
                            >
                              <Avatar
                                image={gerente.Imagen || Usuario_sin_img}
                                onImageError={(e) =>
                                  (e.target.src = Usuario_sin_img)
                                }
                                shape="circle"
                                size="xlarge"
                              />
                              <div style={{ marginTop: "10px" }}>
                                <h3>{gerente.nombreGerente}</h3>
                                <p>{gerente.correo}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No hay gerentes asignados</p>
                      )}
                    </div>
                  )}
                </div>
              )}
              <div className="mt-4">
                <h4 onClick={toggleCoordinadores} className="title">
                  Coordinador
                  <Button
                    icon={
                      showCoordinadores ? "pi pi-angle-up" : "pi pi-angle-down"
                    }
                    className="p-button-rounded p-button-text"
                  />
                </h4>
                <hr />
                {showCoordinadores &&
                  groupedMembers.coordinadores.length > 0 && (
                    <div className="gerentes-container">
                      {groupedMembers.coordinadores.map((member) => {
                        const nombreCompleto = `${member.Nombre} ${member.Apellido_pat} ${member.Apellido_mat}`;

                        return (
                          <div className="p-card" key={member.idUsuario}>
                            <div className="d-flex flex-column justify-content-center align-items-center mb-3">
                              <img
                                src={member.Imagen}
                                alt={nombreCompleto}
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                              <h5>{nombreCompleto}</h5>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>
              <h5 onClick={toggleAsesores} className="title">
                Asesores
                <Button
                  icon={showAsesores ? "pi pi-angle-up" : "pi pi-angle-down"}
                  className="p-button-rounded p-button-text"
                />
              </h5>
                  <hr />
              {showAsesores&&groupedMembers.asesores.length > 0 && (

                  <div className="gerentes-container">
                    {groupedMembers.asesores.map((member) => {
                      const nombreCompleto = `${member.Nombre} ${member.Apellido_pat} ${member.Apellido_mat}`;

                      return (
                        <div className="p-card" key={member.idUsuario}>
                          <div className="d-flex flex-column justify-content-center align-items-center mb-3">
                            <img
                              src={member.Imagen}
                              alt={nombreCompleto}
                              style={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                            <h5>{nombreCompleto}</h5>
                          </div>
                        </div>
                      );
                    })}
                  </div>
              )}

              {groupedMembers.coordinadores.length === 0 &&
                groupedMembers.asesores.length === 0 && (
                  <p>No hay miembros asignados</p>
                )}


              <h2>Equipos Prácticos</h2>
              <DataTable
                value={filteredEquipos}
                rows={5}
                emptyMessage="No hay equipos disponibles."
              >
                <Column field="nombre" header="Nombre" />
                <Column field="miembros" header="# Usuarios" />
                {isAdmin && <Column field="creador" header="Creador" />}
                {/* <Column header='Imágenes' body={imageBodyTemplate} /> */}
                <Column header="Acciones" body={viewButtonTemplate} />
                <Column
                  header=""
                  body={optionsMenu}
                  style={{ textAlign: "center", width: "8em" }}
                />
              </DataTable>
            </div>
          </div>
        </div>
      </div>
      {renderModal()}
    </div>
  );
};
export default Equipos;
