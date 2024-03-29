import React from "react";
import { Row, Col, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import Navbar from "./navbar";
import { ArrowLeft } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthRedirect } from "../useAuthRedirect";
import { API_URL, fetchWithToken } from "../utils/api";

const checkIfCorreoExists = async (correo) => {
  try {
    const response = await fetchWithToken(
      `${API_URL}/colaboradorExiste/${correo}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log("Data:", data);

    return data.existe;
  } catch (error) {
    console.error("Error checking correo:", error);
    return false;
  }
};

function AgregarColab() {
  useAuthRedirect();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const navigate = useNavigate();
  const formData = new FormData();
  const onSubmit = async (data) => {
    Swal.fire({
      title: "Cargando...",
      text: "Por favor espera un momento",
      allowOutsideClick: false,
    });
    Swal.showLoading();
    if (data === undefined) {
      return Swal.fire({
        icon: "error",
        title: "Se requiere llenar el formulario",
        text: "UDA",
        timer: 1200,
        timerProgressBar: true,
        backdrop: `
        rgba(36,32,32,0.65)

      `,
      });
    }
    const correoExists = await checkIfCorreoExists(data.Correo);
    console.log("Correo exists:", correoExists);
    if (correoExists) {
      return Swal.fire({
        icon: "error",
        title: "El correo ya está tomado",
        text: "Por favor, ingresa un correo diferente.",
      });
    }
    let inputElem = document.getElementById("FotoColab");
    let file = inputElem.files[0];
    let blob = file.slice(0);
    const imagen = new File([blob], `${file.name}`);
    data = { ...data, FotoColab: imagen };
    formData.append("Nombre", data.Nombre);
    formData.append("Apellido_pat", data.Apellido_pat);
    formData.append("Apellido_mat", data.Apellido_mat);
    formData.append("Correo", data.Correo);
    formData.append("Telefono", data.Telefono);
    formData.append("IDEquipo", data.IDEquipo);

    formData.append("FotoColab", data.FotoColab);
    console.log(data.FotoColab);
    // data.FotoColab = data.FileList[0];

    console.log(data);
    // Visualizar el contenido de formData
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    let config = {
      method: "POST",
      body: formData, // formData contiene los datos del formulario
    };
    try {
      let res = await fetchWithToken(`${API_URL}/createColaborador`, config);
      Swal.close();
      if (!res.ok) {
        return Swal.fire({
          icon: "error",
          title: "Se produjo un error",
          text: "UDA",
          timer: 1200,
          timerProgressBar: true,
          backdrop: `
          rgba(36,32,32,0.65)
          
          `,
        });
      }
      let json = await res.json();
      console.log(json);
      Swal.fire({
        icon: "success",
        title: "Se agregó tu colaborador exitosamente",
        text: "UDA",
        timer: 1200,
        timerProgressBar: true,
        backdrop: `
        rgba(36,32,32,0.65)
        
      `,
      }).then(() => {
        navigate("/land");
      });
    } catch (error) {
      console.error(error);
      return Swal.fire({
        icon: "error",
        title: "Se produjo un error",
        text: "UDA",
        timer: 1200,
        timerProgressBar: true,
        backdrop: `
        rgba(36,32,32,0.65)
        
      `,
      });
    }
  };

  return (
    <div className="fluid">
      <Navbar style={{ backgroundColor: "##F8F9FA" }}></Navbar>

      <div style={{ backgroundColor: "#F1F5F8" }}>
        <div
          style={{
            paddingTop: "10px",
            paddingBottom: "10px",
            backgroundColor: "#F1F5F8",
          }}
        >
          <Link to="/Land">
            <ArrowLeft className="ml-4 regreso" />
            <span style={{ marginBottom: "100px" }} id="indicador">
              Menu Principal
            </span>
          </Link>
        </div>
      </div>
      <div className="py-md-4 py-3" style={{ backgroundColor: "#F1F5F8" }}>
        <div
          className="row"
          style={{
            marginLeft: "35px",
            marginBottom: "-50px",
            marginRight: "0px",
          }}
        >
          <h2 className="titulo-cambaceo px-0 px-md-5">Agregar Colaborador</h2>
        </div>

        <div
          className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-5 mt-md-4 "
          id="contenedor-cambaceo"
        >
          <Form
            onSubmit={handleSubmit(onSubmit)}
            // encType="multipart/form-data"
            method="post"
            id="form"
          >
            <Row className="mb-5">
              <Col xs={12} md={6}>
                <Form.Group controlid="ColbID">
                  <Form.Label>ColabID</Form.Label>
                  <Form.Control
                    type="string"
                    {...register("ID_Colab", { required: true })}
                    placeholder="Ingresa el ID"
                  />
                  {errors.ColabID?.type === "required" && (
                    <p>Este campo es requerido</p>
                  )}
                </Form.Group>
                <br />
                <Form.Group>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="string"
                    {...register("Nombre", { required: true })}
                    placeholder="Ingresa el nombre"
                  />
                  {errors.Nombre?.type === "required" && (
                    <p>Este campo es requerido</p>
                  )}
                </Form.Group>
                <br />
                <Form.Group>
                  <Form.Label>Apellido Paterno</Form.Label>
                  <Form.Control
                    type="string"
                    {...register("Apellido_pat", {
                      required: true,
                    })}
                    placeholder="Ingresa el apellido"
                  />
                  {errors.Apellido_Paterno?.type === "required" && (
                    <p>Este campo es requerido</p>
                  )}
                </Form.Group>
                <br />
                <Form.Group>
                  <Form.Label>Apellido Materno</Form.Label>
                  <Form.Control
                    type="string"
                    {...register("Apellido_mat", {
                      required: true,
                    })}
                    placeholder="Ingresa el apellido"
                  />
                  {errors.Apellido_Materno?.type === "required" && (
                    <p>Este campo es requerido</p>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Correo</Form.Label>
                  <Form.Control
                    type="email"
                    {...register("Correo", {
                      required: true,
                      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                    })}
                    placeholder="Ingresa el correo"
                  />
                  {errors.Correo?.type === "required" && (
                    <p>Este campo es requerido</p>
                  )}
                  {errors.Correo?.type === "pattern" && (
                    <p>El formato del correo no es valido</p>
                  )}
                </Form.Group>
                <br />
                <Form.Group>
                  <Form.Label>Telefono</Form.Label>
                  <Form.Control
                    type="tel"
                    {...register("Telefono", {
                      required: true,
                      pattern:
                        /^(\(\+?\d{2,3}\)[\|\s|\-|\.]?(([\d][\|\s|\-|\.]?){6})(([\d][\s|\-|\.]?){2})?|(\+?[\d][\s|\-|\.]?){8}(([\d][\s|\-|\.]?){2}(([\d][\s|\-|\.]?){2})?)?)$/i,
                    })}
                    placeholder="Ingresa el numero telefónico"
                  />
                  {errors.Telefono?.type === "required" && (
                    <p>Este campo es requerido</p>
                  )}
                  {errors.Telefono?.type === "pattern" && (
                    <p>El formato del telefono no es valido</p>
                  )}
                </Form.Group>
                <br />
                <Form.Group>
                  <Form.Label>Equipo</Form.Label>
                  <Form.Select {...register("IDEquipo", { required: true })}>
                    <option disabled="disabled">Selecciona una opcion</option>
                    <option value="1">Frontera</option>
                    <option value="2">Medio</option>
                    <option value="3">Sur</option>
                  </Form.Select>
                </Form.Group>
                <br />
                <Form.Group controlId="FotoColab" className="mb-3">
                  <Form.Label>Imagen</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp"
                    // {...register("FotoColab", { required: true })}
                  />
                  {errors.FotoColab?.type === "required" && (
                    <p>Este campo es requerido</p>
                  )}
                </Form.Group>
              </Col>
              <Col>
                <Button
                  type="submit"
                  value="Enviar"
                  variant="success"
                  size="lg"
                  onClick={() => onSubmit()}
                >
                  Confirmar
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
}
export default AgregarColab;
