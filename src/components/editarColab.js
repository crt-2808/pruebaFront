import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import { ArrowLeft } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Usuario_sin_img from "../img/imagen-de-usuario-con-fondo-negro.png";
import { useAuthRedirect } from "../useAuthRedirect";

const EditarColab = () => {
  useAuthRedirect();
  const [colaboradores, setColaboradores] = useState([]);
  const [imageLoaded, setImageLoaded] = useState({});
  const fetchColaboradores = async () => {
    Swal.fire({
      title: "Cargando...",
      text: "Por favor espera un momento",
      allowOutsideClick: false,
    });
    Swal.showLoading();
    try {
      const userData = JSON.parse(sessionStorage.getItem("usuario"));
      const email = userData.email;

      const requestBody = {
        correoLider: email,
      };
      const response = await fetch(
        "https://sarym-production-4033.up.railway.app/api/colaborador",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      Swal.close();
      if (!response.ok) {
        console.log("Error: ", response);
        return Swal.fire({
          icon: "error",
          title: "Se produjo un error",
          text: "UDA",
          timer: 2200,
          timerProgressBar: true,
          backdrop: `
      rgba(36,32,32,0.65)
      
    `,
        });
      }

      const data = await response.json();
      if (data.length === 0) {
        return Swal.fire({
          title: "¡Atención!",
          text: "Todavía no hay ningún colaborador registrado en tu equipo.",
          icon: "info",
          confirmButtonText: "Entendido",
        });
      }
      setColaboradores(data);
    } catch (error) {
      console.error(error);
      return Swal.fire({
        icon: "error",
        title: "Se produjo un error",
        text: "UDA",
        timer: 2200,
        timerProgressBar: true,
        backdrop: `
    rgba(36,32,32,0.65)
    
  `,
      });
    }
  };
  useEffect(() => {
    fetchColaboradores();
  }, []);
  const handleImageError = (e) => {
    e.target.src = Usuario_sin_img; // imagen predeterminada
  };
  const handleEditClick = async (colaborador) => {
    console.log("Colaborador identificado:  ", colaborador);
    try {
      const htmlContent = `
            <div class='row centrar' style='overflow: hidden;'>
                <h4>Seguro que editar este colaborador?</h4>
                <div class='col-md-3 col-xs-6'>
                    <div class='card centrar p-3 mt-3'>
                        <img src='${
                          colaborador.Imagen || Usuario_sin_img
                        }' class='img-fluid' id='img-card' onerror="this.onerror=null; this.src='${Usuario_sin_img}';">
                        <h3>${colaborador.Nombre}</h3>
                        <h4>${colaborador.Apellido_pat} ${
        colaborador.Apellido_mat
      }</h4>
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
        console.log("Confirmado");
        const createEditHtmlContent = (colaborador) => {
          return `
              <div class='row centrar' style='overflow: hidden;'>
                  <h4>Información del colaborador</h4>
                  <div class='col-md-3 col-xs-6'>
                      <div class=' container centrar p-3 mt-3'>
                          <div class='row'>
                              <div class='col-md-3 col-xs-6'>
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
                                  </form>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          `;
        };

        const createInput = (type, id, placeholder, value) => {
          return `<input type='${type}' required class="modal-edit-input" id='${id}' placeholder='${placeholder}' value='${value}'>`;
        };
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
          console.log("dentro");
          try {
            const getVal = (id) => document.getElementById(id).value;

            const valoresUp = {
              Nombre: getVal("nombreUp"),
              Apellido_pat: getVal("apellidoPatUp"),
              Apellido_mat: getVal("apellidoMatUp"),
              Correo: getVal("correoUp"),
              Telefono: getVal("telefonoUp"),
              IDEquipo: colaborador.IDEquipo,
              IDLider: colaborador.IDLider,
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
            const response = await fetch(
              `https://sarym-production-4033.up.railway.app/api/colaborador/${colaborador.ID_Colab}`,
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
              Swal.fire({
                title: "Editado!",
                text: `Has editado al colaborador.`,
                icon: "success",
                timer: 2000,
                timerProgressBar: true,
              });
            } else {
              Swal.fire(
                "Error!",
                `Ha ocurrido un error al actualizar al colaborador ${colaborador.Nombre}.`,
                "error"
              );
            }
          } catch (error) {
            console.log(error);
            return Swal.fire("Error!", `Ha ocurrido un error.`, "error");
          }
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          "Cancelado",
          "No se ha modificado ningun colaborador :)",
          "warning"
        );
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error!", `Ha ocurrido un error.`, "error");
    }
  };

  const ColaboradorCard = ({ data }) => {
    return (
      <div className="col-md-3">
        <div className="card centrar p-3">
          <img
            src={data.Imagen || Usuario_sin_img}
            onError={(e) => (e.target.src = Usuario_sin_img)}
            alt="Colaborador"
            className="img-fluid"
            id="img-card"
          />
          <h3>{data.Nombre}</h3>
          <h4>{`${data.Apellido_pat} ${data.Apellido_mat}`}</h4>
          <h6 className="email"> {data.Correo}</h6>
          <h6>{data.Telefono}</h6>
          <svg
            className="editar"
            value={data.ID_Colab}
            onClick={() => handleEditClick(data)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.8 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
          </svg>
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
          <div className="container-fluid mt-5 mb-5">
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
