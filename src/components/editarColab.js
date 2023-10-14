import React, { useEffect } from "react";
import Navbar from "./navbar";
import { ArrowLeft } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Usuario_sin_img from "../img/imagen-de-usuario-con-fondo-negro.png";

const EditarColab = () => {
  const navigate = useNavigate();

  const options = {
    method: "GET",
    mode: "cors",
  };
  const handleImageError = (e) => {
    e.target.src = Usuario_sin_img; // imagen predeterminada
  };
  var arr = [];
  const colab = async () => {
    const otroRes = document.querySelector("#Resultado");
    Swal.fire({
      title: "Cargando...",
      text: "Por favor espera un momento",
      allowOutsideClick: false,
    });
    Swal.showLoading();
    try {
      const response = await fetch(
        "https://sarym-production-4033.up.railway.app/api/colaborador",
        options
      );
      Swal.close();
      if (
        response.status == 500 ||
        response.status == 404 ||
        response.status == 400
      ) {
        return Swal.fire({
          icon: "error",
          title: "Se produjo un error",
          text: "UDA",
          timer: 2200,
          timerProgressBar: true,
          backdrop: `
      rgba(36,32,32,0.65)
      
    `,
        }).then(() => {
          navigate("/land");
        });
      }
      const data = await response.json();
      for (let i = 0; i < data.length; i++) {
        arr.push(data[i]);
      }

      for (let i = 0; i < data.length; i++) {
        if (arr[i].Imagen == "src") {
          arr[i].Imagen = Usuario_sin_img;
        }
        otroRes.innerHTML += ` <div class='col-md-3 '>
        <div class='card centrar p-3'>
          <img src='${
            arr[i].Imagen
          }' class='img-fluid' id='img-card' onerror="this.onerror=null; this.src='${Usuario_sin_img}';">
          <h3>${arr[i].Nombre}</h3>
          <h4>${arr[i].Apellido_pat + " " + arr[i].Apellido_mat}</h4>
          <h6>${arr[i].Correo}</h6>
          <h6>${arr[i].Telefono}</h6>
          <svg class='editar' value='${
            arr[i].ID_Colab
          }' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.8 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>
          </div>
       </div>`;
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Algo salió mal al cargar los colaboradores!",
      });
      otroRes.innerHTML =
        '<div class="row centrar error-fetch">Hubo un error :( <br> Intentalo de nuevo</div>';
    }
    console.log(arr);
    const editIcon = document.querySelectorAll(".editar");
    editIcon.forEach((item) => {
      item.addEventListener("click", () => {
        try {
          console.log("Hola ");
          const idColab = item.getAttribute("value");
          console.log(idColab);
          var arrColab = [];
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].ID_Colab == idColab) {
              arrColab.push(arr[i]);
            }
          }
          console.log("Colaborador identificado:  ", arrColab);
          Swal.fire({
            width: 1100,
            title: "<strong>EDITAR <p>Colaborador</p></strong>",
            icon: "warning",
            html: `
            <div class='row centrar' style='overflow: hidden;'>
            <h4>Seguro que editar este colaborador?</h4>
            
            <div class='col-md-3 col-xs-6'>
            <div class='card centrar p-3 mt-3'>
            <img src='${
              arrColab[0].Imagen
            }' class='img-fluid' id='img-card' onerror="this.onerror=null; this.src='${Usuario_sin_img}';">
            <h3>${arrColab[0].Nombre}</h3>
            <h4>${
              arrColab[0].Apellido_pat + " " + arrColab[0].Apellido_mat
            }</h4>
            <h6>${arrColab[0].Correo}</h6>
            <h6>${arrColab[0].Telefono}</h6>
            
            </div>
            </div>
            </div>
                  `,

            text: "Something went wrong!",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Editar colaborador",
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                Swal.fire({
                  width: 1100,
                  title: "<strong>EDITAR <p>Colaborador</p></strong>",
                  icon: "warning",
                  html: `
            <div class='row centrar' style='overflow: hidden;'>
            <h4>Información del colaborador</h4>
            
            <div class='col-md-3 col-xs-6'>
            <div class=' container centrar p-3 mt-3'>
            <div class='row'>
            <div class='col-md-3 col-xs-6'>
            <form action="#" method="post">
            <input type='text' required class="modal-edit-input" id='nombreUp' placeholder='Nombre' value='${arrColab[0].Nombre}'>
            <input type='text' required class="modal-edit-input" id='apellidoPatUp' placeholder='Apellido Paterno' value='${arrColab[0].Apellido_pat}'>
            <input type='text' required class="modal-edit-input" id='apellidoMatUp' placeholder='Apellido Materno' value='${arrColab[0].Apellido_mat}'>
            <input type='email' required class="modal-edit-input" id='correoUp' placeholder='Correo' value='${arrColab[0].Correo}'>
            <input type='tel' required class="modal-edit-input" id='telefonoUp' placeholder='Telefono' value='${arrColab[0].Telefono}'>
            </form>
            </div>
            </div>
            </div>
            </div>
            </div>
                  `,

                  text: "Something went wrong!",
                  showCancelButton: true,
                  cancelButtonText: "Cancelar",
                  confirmButtonText: "Editar colaborador",
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    try {
                      const Nombre_value =
                        document.querySelector("#nombreUp").value;

                      const Apellido_pat_value =
                        document.querySelector("#apellidoPatUp").value;
                      const Apellido_mat_value =
                        document.querySelector("#apellidoMatUp").value;
                      const Correo_value =
                        document.querySelector("#correoUp").value;
                      const Telefono_value =
                        document.querySelector("#telefonoUp").value;
                      const IDEquipo_value = arrColab[0].IDEquipo;
                      const IDLide_valuer = arrColab[0].IDLider;
                      const valoresUp = {
                        Nombre: Nombre_value,
                        Apellido_pat: Apellido_pat_value,
                        Apellido_mat: Apellido_mat_value,
                        Correo: Correo_value,
                        Telefono: Telefono_value,
                        IDEquipo: IDEquipo_value,
                        IDLider: IDLide_valuer,
                      };
                      console.log(valoresUp);
                      const updateOpt = {
                        method: "PUT",
                        mode: "cors",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(valoresUp),
                      };

                      try {
                        console.log("Holi");
                        const response = await fetch(
                          `https://sarym-production-4033.up.railway.app/api/colaborador/${idColab}`,
                          updateOpt
                        );
                        Swal.fire(
                          "Editado!",
                          `Has editado al colaborador.`,
                          "success"
                        ).then(() => {
                          navigate("/editarColab");
                        });
                      } catch (error) {
                        Swal.fire("Error!", `Ha ocurrido un error.`, "error");
                        console.log(error);
                      }
                    } catch (error) {
                      Swal.fire("Error!", `Ha ocurrido un error.`, "error");
                      console.log(error);
                    }
                  } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire(
                      "Cancelado",
                      "No se ha borrado ningun colaborador :)",
                      "warning"
                    );
                  }
                });
              } catch (error) {
                Swal.fire("Error!", `Ha ocurrido un error.`, "error");
              }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire(
                "Cancelado",
                "No se ha borrado ningun archivo :)",
                "warning"
              );
            }
          });
        } catch (error) {
          Swal.fire("Error!", `Ha ocurrido un error.`, "error");
        }
      });
    });
  };

  useEffect(() => {
    colab();
  }, []);
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
            <div className="row px-2 gy-4" id="Resultado"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarColab;
