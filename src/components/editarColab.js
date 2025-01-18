import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import { ArrowLeft, Trash, Pencil, ArrowRepeat } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { showNotification } from "../utils/utils";
import Usuario_sin_img from "../img/imagen-de-usuario-con-fondo-negro.png";
import { useAuthRedirect } from "../useAuthRedirect";
import { API_URL, fetchWithToken } from "../utils/api";
import { Tooltip } from "primereact/tooltip";
import { Button } from "primereact/button";

const EditarColab = () => {
  useAuthRedirect();
  const [colaboradores, setColaboradores] = useState([]);
  const roleOptions = [
    { label: "Gerente", value: "gerente" },
    { label: "Coordinador", value: "coordinador" },
    { label: "Asesor", value: "colaborador" },
  ];

  const fetchColaboradores = async () => {
    Swal.fire({
      title: "Cargando...",
      text: "Por favor espera un momento",
      allowOutsideClick: false,
    });
    Swal.showLoading();
    try {
      const response = await fetchWithToken(`${API_URL}/colaborador`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      Swal.close();
      if (!response) return; // Si se redirige al usuario, no continuar
      if (!response.ok) {
        console.log("Error: ", response);
        return showNotification("error", "Se produjo un error", "UDA");
      }

      const data = await response.json();
      if (data.length === 0) {
        return showNotification(
          "info",
          "Todavía no hay ningún usuario registrado en tu equipo.",
          "UDA"
        );
      }

      // Ordenar colaboradores: primero por estado activo, luego por rol
      const colaboradoresOrdenados = data
        .sort((a, b) => b.Activo - a.Activo) // Activos primero
        .sort((a, b) => rolPrioridad(a.Rol) - rolPrioridad(b.Rol)); // Gerente > Coordinador > Asesor

      setColaboradores(colaboradoresOrdenados);
    } catch (error) {
      console.error(error);
      return showNotification("error", "Se produjo un error", "UDA");
    }
  };

  // Asignar prioridad a los roles
  const rolPrioridad = (rol) => {
    switch (rol) {
      case "gerente":
        return 1;
      case "coordinador":
        return 2;
      case "Asesor": // Asesor (antes colaborador)
        return 3;
      default:
        return 4; // Por si se agrega un rol no contemplado
    }
  };

  useEffect(() => {
    fetchColaboradores();
  }, []);

  const handleDeleteClick = async (colaborador) => {
    const razones = {
      "baja voluntaria": "Baja voluntaria",
      "baja por violar datos de prospecto": "Baja por violar datos de prospecto",
      "baja por falsificación de datos de prospecto": "Baja por falsificación de datos de prospecto",
      "baja por no reportar pagos a líder": "Baja por no reportar pagos a líder",
    };
  
    // Seleccionar la razón de la baja
    const { value: razon } = await Swal.fire({
      title: "Selecciona la razón de la baja",
      input: "select",
      inputOptions: razones,
      inputPlaceholder: "Seleccionar tipo de baja",
      showCancelButton: true,
    });
  
    if (razon) {
      // Verificar si el usuario pertenece a un equipo
      const equipoResponse = await fetchWithToken(`${API_URL}/verificarEquipo/${colaborador.idUsuario}`, {
        method: "GET",
      });
  
      const equipoResult = await equipoResponse.json();
  
      if (equipoResponse.ok && equipoResult.perteneceAEquipo) {
        // Mostrar Swal para confirmar si pertenece a un equipo
        const confirmResult = await Swal.fire({
          icon: "warning",
          title: "El usuario pertenece a un equipo",
          text: "¿Deseas continuar? Si lo haces, será eliminado del equipo.",
          showCancelButton: true,
          confirmButtonText: "Continuar",
          cancelButtonText: "Cancelar",
        });
  
        if (!confirmResult.isConfirmed) {
          return Swal.fire({
            icon: "info",
            title: "Operación cancelada",
            text: "No se realizó ningún cambio.",
            timer: 5300,
            showConfirmButton: false,
          });
        }
      }
  
      // Si no pertenece a un equipo o se confirmó, proceder con la baja
      const response = await fetchWithToken(`${API_URL}/bajaUsuario/${colaborador.idUsuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ razon }),
      });
  
      if (!response.ok) {
        const result = await response.json();
        return Swal.fire("Error", result.message || "No se pudo dar de baja al usuario.", "error");
      }
  
      // Actualizar el estado en el frontend
      const updatedColaboradores = colaboradores.map((colab) => {
        if (colab.idUsuario === colaborador.idUsuario) {
          return { ...colab, Activo: 0, RazonBaja: razones[razon] };
        }
        return colab;
      });
      setColaboradores(updatedColaboradores);
  
      return Swal.fire("Éxito", "Has dado de baja al usuario.", "success");
    }
  };
  
  const createInput = (type, id, placeholder, value) => {
    return `<input type='${type}' required class="modal-edit-input" id='${id}' placeholder='${placeholder}' value='${value}'>`;
  };

  const createDropdown = (id, options, selectedValue) => {
    return `
      <select id='${id}' class='modal-edit-input'>
        ${options
          .map(
            (option) => `
          <option value='${option.value}' ${
              option.value === selectedValue ? "selected" : ""
            }>
            ${option.label}
          </option>
        `
          )
          .join("")}
      </select>
    `;
  };

  const createEditHtmlContent = (colaborador) => {
    return `
      <div class='row centrar' style='overflow: hidden;'>
        <h4>Información del Usuario</h4>
        <div class='col-md-4 col-xs-6'>
          <div class=' container centrar p-3 mt-3'>
            <div class='row'>
              <div class='col-12'>
                <form action="#" method="post">
                  ${createInput(
                    "text",
                    "nombreUp",
                    "Nombre",
                    colaborador.Nombre
                  )}
                  ${createInput(
                    "text",
                    "apellidoPatUp",
                    "Apellido Paterno",
                    colaborador.Apellido_pat
                  )}
                  ${createInput(
                    "text",
                    "apellidoMatUp",
                    "Apellido Materno",
                    colaborador.Apellido_mat
                  )}
                  ${createInput(
                    "email",
                    "correoUp",
                    "Correo",
                    colaborador.Correo
                  )}
                  ${createInput(
                    "tel",
                    "telefonoUp",
                    "Telefono",
                    colaborador.Telefono
                  )}
                  ${createDropdown("rolUp", roleOptions, colaborador.Rol)}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };
  const handleEditClick = async (colaborador) => {
    console.log("Usuario identificado:  ", colaborador);
    try {
      const htmlContent = `
        <div class='row centrar' style='overflow: hidden;'>
          <h4>Seguro que editar este usuario?</h4>
          <div class='col-md-3 col-xs-6'>
            <div class='card centrar p-3 mt-3'>
              <img src='${
                colaborador.Imagen || Usuario_sin_img
              }' class='img-fluid' id='img-card' onerror="this.onerror=null; this.src='${Usuario_sin_img}';">
              <h3>${colaborador.Nombre}</h3>
              <h4>${colaborador.Apellido_pat} ${colaborador.Apellido_mat}</h4>
              <h6>${colaborador.Correo}</h6>
              <h6>${colaborador.Telefono}</h6>
            </div>
          </div>
        </div>
      `;
      const result = await Swal.fire({
        width: 1100,
        title: "<strong>EDITAR <p>Usuario</p></strong>",
        icon: "warning",
        html: htmlContent,
        text: "Something went wrong!",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Editar usuario",
      });
      if (result.isConfirmed) {
        const editHtmlContent = createEditHtmlContent(colaborador);

        const editResult = await Swal.fire({
          width: 1100,
          title: "<strong>EDITAR <p>Usuario</p></strong>",
          icon: "warning",
          html: editHtmlContent,
          text: "Something went wrong!",
          showCancelButton: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Editar colaborador",
        });
        if (editResult.isConfirmed) {
          try {
            const getVal = (id) => document.getElementById(id).value;

            const valoresUp = {
              Nombre: getVal("nombreUp"),
              Apellido_pat: getVal("apellidoPatUp"),
              Apellido_mat: getVal("apellidoMatUp"),
              Correo: getVal("correoUp"),
              Telefono: getVal("telefonoUp"),
              Rol: getVal("rolUp"), // Agregar el rol
            };
            console.log("Valores:", valoresUp);

            const updateOpt = {
              method: "PUT",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(valoresUp),
            };
            Swal.fire({
              title: "Cargando...",
              text: "Por favor espera un momento",
              allowOutsideClick: false,
            });
            Swal.showLoading();
            const response = await fetchWithToken(
              `${API_URL}/updateUsuario/${colaborador.idUsuario}`,
              updateOpt
            );
            Swal.close();

            if (response.ok) {
              const updatedColaboradores = colaboradores.map((colab) => {
                if (colab.ID_Colab === colaborador.ID_Colab) {
                  return { ...colab, ...valoresUp };
                }
                return colab;
              });
              setColaboradores(updatedColaboradores);
              showNotification(
                "success",
                "Editado!",
                "Has editado al usuario."
              );
              window.location.reload();
            } else {
              showNotification(
                "error",
                "Error!",
                `Ha ocurrido un error al actualizar al usuario ${colaborador.Nombre}.`
              );
            }
          } catch (error) {
            console.log(error);
            return showNotification("error", "Se produjo un error", "UDA");
          }
        }
      }
    } catch (error) {
      console.log(error);
      showNotification("error", "Se produjo un error", "UDA");
    }
  };

  const ColaboradorCard = ({ data }) => {
    const isActive = data.Activo === 1;
    const showReassignIcon = ["coordinador", "Asesor"].includes(data.Rol);

    const handleReactivarClick = async (idUsuario) => {
      try {
        // Mostrar confirmación con SweetAlert2
        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: '¿Deseas reactivar a este colaborador?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Reactivar',
          cancelButtonText: 'Cancelar',
          reverseButtons: true,
        });
    
        if (result.isConfirmed) {
          // Si el usuario confirma, procede con la reactivación
          const response = await fetchWithToken(
            `${API_URL}/reactivarUsuario/${idUsuario}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
    
          const responseData = await response.json();
          if (response.ok) {
            showNotification('success', 'Reactivado', responseData.message);
            window.location.reload(); // Refrescar la página
          } else {
            showNotification('error', 'Error', responseData.message);
          }
        } else {
          // Si se cancela, muestra una notificación opcional
          Swal.fire('Cancelado', 'La reactivación ha sido cancelada.', 'info');
        }
      } catch (error) {
        console.error('Error al reactivar el usuario:', error);
        showNotification(
          'error',
          'Error',
          'Ocurrió un error al intentar reactivar el usuario.'
        );
      }
    };

    return (
      <div className="col-md-3">
        <div className="card centrar p-3">
          <div className="user-status">
            <img
              src={data.Imagen || Usuario_sin_img}
              onError={(e) => (e.target.src = Usuario_sin_img)}
              alt="Colaborador"
              className="img-fluid"
              id="img-card"
            />
            <span
              className={`status-indicator ${isActive ? "active" : "inactive"}`}
            ></span>
          </div>
          <h3>{data.Nombre}</h3>
          <h4>{`${data.Apellido_pat} ${data.Apellido_mat}`}</h4>
          <h5>{data.Rol}</h5>
          <h6 className="email">{data.Correo}</h6>
          <h6>{data.Telefono}</h6>

          {!isActive ? (
            <div className="col-12 centrar">
              <Button
                label="Reactivar"
                icon="pi pi-refresh"
                className="p-button-success"
                onClick={() => handleReactivarClick(data.idUsuario)}
              />
            </div>
          ) : (
            <div className="col-12 centrar">
              <span id={`tooltip-edit-${data.idUsuario}`}>
                <Pencil
                  className="editar"
                  value={data.ID_Colab}
                  onClick={() => handleEditClick(data)}
                />
              </span>
              <Tooltip
                target={`#tooltip-edit-${data.idUsuario}`}
                content="Editar usuario"
                position="top"
              />

              <span id={`tooltip-delete-${data.idUsuario}`}>
                <Trash
                  className="basura"
                  value={data.ID_Colab}
                  onClick={() => handleDeleteClick(data)}
                />
              </span>
              <Tooltip
                target={`#tooltip-delete-${data.idUsuario}`}
                content="Dar de baja"
                position="top"
              />

              {showReassignIcon && (
                <>
                  <span
                    id={`tooltip-reassign-${data.idUsuario}`}
                    className="reassign-icon"
                    onClick={() => handleReassignClick(data)}
                  >
                    <ArrowRepeat className="editar" />
                  </span>
                  <Tooltip
                    target={`#tooltip-reassign-${data.idUsuario}`}
                    content="Reasignar usuario"
                    position="top"
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
  const handleReassignClick = async (colaborador) => {
    try {
      const htmlContent = `
        <div class='row centrar' style='overflow: hidden;'>
          <h4>¿Seguro que deseas reasignar a este usuario?</h4>
          <div class='col-md-3 col-xs-6'>
            <div class='card centrar p-3 mt-3'>
              <img 
                src='${colaborador.Imagen || Usuario_sin_img}' 
                class='img-fluid' 
                id='img-card' 
                onerror="this.onerror=null; this.src='${Usuario_sin_img}';" 
              />
              <h3>${colaborador.Nombre}</h3>
              <h4>${colaborador.Apellido_pat} ${colaborador.Apellido_mat}</h4>
              <h6>${colaborador.Correo}</h6>
              <h6>${colaborador.Telefono}</h6>
            </div>
          </div>
        </div>
      `;
  
      const result = await Swal.fire({
        width: 1100,
        title: "<strong>REASIGNAR <p>Usuario</p></strong>",
        icon: "warning",
        html: htmlContent,
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Seleccionar Gerente",
      });
  
      if (result.isConfirmed) {
        try {
          // Verificar si el colaborador está en un equipo
          const equipoResponse = await fetchWithToken(
            `${API_URL}/verificarEquipo/${colaborador.idUsuario}`,
            {
              method: "GET",
            }
          );
  
          const equipoData = await equipoResponse.json();

          console.log(equipoData)
            
          // Filtrar los gerentes y coordinadores
          const gerentes = colaboradores.filter(
            (colab) => colab.Rol === "gerente" || colab.Rol === "coordinador"
          );
  
          await Swal.fire({
            width: 1100,
            title: "Selecciona un Gerente o Coordinador",
            html: `
              <div class="container px-5">
                <div class="row px-4">
                  ${gerentes
                    .map(
                      (gerente) => `
                      <div class="col-md-4 my-1">
                        <div class="card gerente-card" data-id="${gerente.idUsuario}">
                          <img 
                            src="${gerente.Imagen || Usuario_sin_img}" 
                            class="card-img-top" 
                            alt="Imagen de Gerente" 
                          />
                          <div class="card-body">
                            <h5 class="card-title">${gerente.Nombre} ${gerente.Apellido_pat}</h5>
                            <p class="card-text">${gerente.Correo}</p>
                            <h5 class="card-title">${gerente.Rol}</h5>
                          </div>
                        </div>
                      </div>
                    `
                    )
                    .join("")}
                </div>
              </div>
            `,
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            showConfirmButton: false,
            didOpen: () => {
              document.querySelectorAll(".gerente-card").forEach((card) => {
                card.addEventListener("click", async (e) => {
                  const selectedGerenteId = card.getAttribute("data-id");
                  console.log(`ID del Colaborador: ${colaborador.idUsuario}`);
                  console.log(`ID del Gerente seleccionado: ${selectedGerenteId}`);
  
                  // Llamar a la API de reasignación
                  await reasignar(colaborador.idUsuario, selectedGerenteId);
                  Swal.fire("Reasignación Exitosa", "El colaborador fue reasignado correctamente", "success");
                });
              });
            },
          });
        } catch (error) {
          console.error("Error al verificar equipo: ", error);
          showNotification("error", "No se pudo verificar el equipo del colaborador", "UDA");
        }
      }
    } catch (error) {
      console.error("Error general:", error);
      showNotification("error", "Se produjo un error", "UDA");
    }
  };
  

  const reasignar = async (idUsuario, idGerente) => {
    try {
      //TODO: Para reasignar mostrar el lider que se selecciono y al que pertenece
      const response = await fetchWithToken(`${API_URL}/reasignarUsuario`, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idUsuario, idGerente }),
      });

      const result = await response.json();

      //TOOD: Si pertenece a un equipo detener el proceso para dar de baja del equipo
      

      if (response.ok) {
        console.log(result.message);
        showNotification("success", "Reasignado", result.message);
      } else {
        console.error(result.message);
        showNotification("error", "Error", result.message);
      }
    } catch (error) {
      console.error("Error al reasignar el usuario:", error);
      showNotification(
        "error",
        "Error",
        "Ocurrió un error al reasignar el usuario."
      );
    } finally {
      window.location.reload();
    }
  };

  return (
    <div className="fluid">
      <Navbar></Navbar>
      <div className="Colab">
        <div className="container-fluid px-4">
          <div className="row table_space mt-4">
            <div className="col-md-12 d-flex justify-content-center align-items-center mb-3">
              <Link to="/land">
                <ArrowLeft className="ml-4 regreso" />
              </Link>

              <h3 className="fs-4 text-center m-0 ">Usuarios</h3>
            </div>
          </div>
          <div className="container-fluid mt-3 mt-md-5 mb-5">
            <div className="row px-2 gy-4" id="Resultado">
              {colaboradores.map((colab, index) => (
                <ColaboradorCard key={index} data={colab} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarColab;
