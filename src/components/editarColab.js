import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import { ArrowLeft, Trash, Pencil } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { showNotification } from "../utils/utils";
import Usuario_sin_img from "../img/imagen-de-usuario-con-fondo-negro.png";
import { useAuthRedirect } from "../useAuthRedirect";
import { API_URL, fetchWithToken } from "../utils/api";
import { getUserRole, isUserAdmin } from "../utils/auth";

const EditarColab = () => {
  useAuthRedirect();
  const [colaboradores, setColaboradores] = useState([]);
  const [imageLoaded, setImageLoaded] = useState({});
  const roleOptions = [
    { label: 'Gerente', value: 'gerente' },
    { label: 'Coordinador', value: 'coordinador' },
    { label: 'Colaborador', value: 'colaborador' },
  ];
  const isAdmin = isUserAdmin();
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
      if (!response) {
        // Si fetchWithToken redirige al usuario, no continuamos el flujo
        return;
      }
      if (!response.ok) {
        console.log("Error: ", response);
        return showNotification("error", "Se produjo un error", "UDA");
      }

      const data = await response.json();
      console.log("Colaboradores: ", data);
      if (data.length === 0) {
        return showNotification(
          "info",
          "Todavía no hay ningún colaborador registrado en tu equipo.",
          "UDA"
        );
      }
      // Ordenar colaboradores: activos primero, inactivos después
      const colaboradoresOrdenados = data.sort((a, b) => {
        return b.Activo - a.Activo;
      });

      setColaboradores(colaboradoresOrdenados);
    } catch (error) {
      console.error(error);
      return showNotification("error", "Se produjo un error", "UDA");
    }
  };
  useEffect(() => {
    fetchColaboradores();
  }, []);
  const handleImageError = (e) => {
    e.target.src = Usuario_sin_img; // imagen predeterminada
  };
  const handleDeleteClick = async (colaborador) => {
    const razones = {
      "baja voluntaria": "Baja voluntaria",
      "baja por violar datos de prospecto":
        "Baja por violar datos de prospecto",
      "baja por falsificación de datos de prospecto":
        "Baja por falsificación de datos de prospecto",
      "baja por no reportar pagos a líder":
        "Baja por no reportar pagos a líder",
    };

    const { value: razon } = await Swal.fire({
      title: "Selecciona la razón de la baja",
      input: "select",
      inputOptions: razones,
      inputPlaceholder: "Seleccionar tipo de baja",
      showCancelButton: true,
    });

    if (razon) {
      const confirmResult = await Swal.fire({
        icon: "warning",
        title: "Baja",
        html: `<p>¿Quieres dar de baja a <strong>${colaborador.Nombre}</strong> por la razón: <strong>${razones[razon]}</strong>?</p>`,
        showCancelButton: true,
        confirmButtonText: "Dar baja",
      });

      if (confirmResult.isConfirmed) {
        Swal.fire({
          title: "Cargando...",
          text: "Por favor espera un momento",
          allowOutsideClick: false,
        });
        Swal.showLoading();
        const baja = await fetchWithToken(
          `${API_URL}/bajaColaborador/${colaborador.idUsuario}`,
          {
            method: "PUT",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ razon }),
          }
        );
        Swal.close();
        if (!baja.ok) {
          console.log("Error: ", baja);
          return showNotification(
            "error",
            "Se produjo un error",
            "No se pudo dar de baja al colaborador"
          );
        }
        const updatedColaboradores = colaboradores.map((colab) => {
          if (colab.idUsuario === colaborador.idUsuario) {
            return { ...colab, Activo: 0, RazonBaja: razones[razon] };
          }
          return colab;
        });
        setColaboradores(updatedColaboradores);
        return Swal.fire(
          "Success",
          "Has dado de baja a un colaborador",
          "success"
        );
      }
    }
  };
  const createInput = (type, id, placeholder, value) => {
    return `<input type='${type}' required class="modal-edit-input" id='${id}' placeholder='${placeholder}' value='${value}'>`;
  };
  
  const createDropdown = (id, options, selectedValue) => {
    return `
      <select id='${id}' class='modal-edit-input'>
        ${options.map(option => `
          <option value='${option.value}' ${option.value === selectedValue ? 'selected' : ''}>
            ${option.label}
          </option>
        `).join('')}
      </select>
    `;
  };
  
  const createEditHtmlContent = (colaborador) => {
    return `
      <div class='row centrar' style='overflow: hidden;'>
        <h4>Información del colaborador</h4>
        <div class='col-md-4 col-xs-6'>
          <div class=' container centrar p-3 mt-3'>
            <div class='row'>
              <div class='col-12'>
                <form action="#" method="post">
                  ${createInput("text", "nombreUp", "Nombre", colaborador.Nombre)}
                  ${createInput("text", "apellidoPatUp", "Apellido Paterno", colaborador.Apellido_pat)}
                  ${createInput("text", "apellidoMatUp", "Apellido Materno", colaborador.Apellido_mat)}
                  ${createInput("email", "correoUp", "Correo", colaborador.Correo)}
                  ${createInput("tel", "telefonoUp", "Telefono", colaborador.Telefono)}
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
    console.log("Colaborador identificado:  ", colaborador);
    try {
      const htmlContent = `
        <div class='row centrar' style='overflow: hidden;'>
          <h4>Seguro que editar este colaborador?</h4>
          <div class='col-md-3 col-xs-6'>
            <div class='card centrar p-3 mt-3'>
              <img src='${colaborador.Imagen || Usuario_sin_img}' class='img-fluid' id='img-card' onerror="this.onerror=null; this.src='${Usuario_sin_img}';">
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
        title: "<strong>EDITAR <p>Colaborador</p></strong>",
        icon: "warning",
        html: htmlContent,
        text: "Something went wrong!",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Editar colaborador",
      });
      if (result.isConfirmed) {
        const editHtmlContent = createEditHtmlContent(colaborador);
  
        const editResult = await Swal.fire({
          width: 1100,
          title: "<strong>EDITAR <p>Colaborador</p></strong>",
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
              `${API_URL}/updateColaborador/${colaborador.idUsuario}`,
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
                "Has editado al colaborador."
              );
            } else {
              showNotification(
                "error",
                "Error!",
                `Ha ocurrido un error al actualizar al colaborador ${colaborador.Nombre}.`
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
          <h6 className="email"> {data.Correo}</h6>
          <h6>{data.Telefono}</h6>
          {!isActive && (
            <div>
              <strong>Razón de Baja:</strong>
              <p>{data.RazonBaja || "No especificada"}</p>
            </div>
          )}
          {isAdmin && (
            <div>
              <strong>Creado por:</strong>
              <p>{data.creado_por || "No especificada"}</p>
              <strong>Fecha creación:</strong>
              <p>{data.fecha_creacion || "No especificada"}</p>

              {data.fecha_modificacion && (
                <div>
                  <strong>Fecha modificación:</strong>
                  <p>{data.fecha_modificacion}</p>
                </div>
              )}

              <strong>Id Usuario:</strong>
              <p>{data.idUsuario || "No especificado"}</p>
            </div>
          )}

          {isActive && (
            <div className="col-12 centrar">
              <Pencil
                className="editar"
                value={data.ID_Colab}
                onClick={() => handleEditClick(data)}
              />
              <Trash
                className="basura"
                value={data.ID_Colab}
                onClick={() => handleDeleteClick(data)}
              />
            </div>
          )}
        </div>
      </div>
    );
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

              <h3 className="fs-4 text-center m-0 ">Colaboradores</h3>
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
