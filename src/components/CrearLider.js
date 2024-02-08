import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Navbar from "./navbar";
import { ArrowLeft } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthRedirect } from "../useAuthRedirect";
import { API_URL, fetchWithToken } from "../utils/api";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";

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

function CrearLider() {
  useAuthRedirect();
  const [telefono, setTelefono] = useState("");
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    mode: "onBlur",
  });

  const navigate = useNavigate();
  useEffect(() => {
    register("Telefono");
  }, [register]);
  const handleTelefonoChange = (e) => {
    const value = e.value || e.target.value;
    setTelefono(value);
    setValue("Telefono", value, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
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
    console.log("Todos los datos del formulario:", getValues());
    console.log("Data:", data);

    Swal.fire({
      title: "Registrando colaborador",
      text: "Por favor espere...",
      allowOutsideClick: false,
      showConfirmButton: false,
    });
    Swal.showLoading();
    try {
      let res = await fetchWithToken(`${API_URL}/createLider`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
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
        title: "Se agregó un nuevo líder correctamente",
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
      <div
        className="py-md-4 py-3 container-fluid d-flex align-items-center justify-content-center"
        style={{ backgroundColor: "#F1F5F8", minHeight: "87vh" }}
      >
        <div className="w-100 text-center">
          <div
            className="row"
            style={{
              marginLeft: "35px",
              marginBottom: "-50px",
              marginRight: "0px",
            }}
          >
            <h2 className="titulo-cambaceo px-0 px-md-5">Agregar un Líder</h2>
          </div>

          <div
            className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-5 mt-md-4"
            id="contenedor-cambaceo"
            style={{ marginBottom: "0px" }}
          >
            <Row className="mb-5">
              <h3 className="text-start mb-4" style={{ color: "#C4C4C4" }}>
                Agrega los datos faltantes
              </h3>
              <Col xs={12} md={6}>
                <div className="p-field text-start p-2">
                  <label htmlFor="NombreCompleto">
                    Nombre Completo
                    <br />
                  </label>
                </div>
                <div>
                  <InputText
                    {...register("Nombre", {
                      required: "Este campo es obligatorio",
                    })}
                    placeholder="Nombre"
                    style={{ width: "100%" }}
                    className={errors.Nombre ? "p-invalid" : ""}
                  />
                  {errors.Nombre && (
                    <small className="p-error">{errors.Nombre.message}</small>
                  )}
                </div>
                <div className="p-field text-start p-2">
                  <label htmlFor="Apellido-Pat">Apellido Paterno</label>
                </div>
                <div>
                  <InputText
                    {...register("Apellido_Pat", {
                      required: "Este campo es obligatorio",
                    })}
                    placeholder="Apellido Paterno"
                    style={{ width: "100%" }}
                    className={errors["Apellido_Pat"] ? "p-invalid" : ""}
                  />
                  {errors.Apellido_Pat && (
                    <small className="p-error">
                      {errors.Apellido_Pat.message}
                    </small>
                  )}
                </div>

                <div className="p-field text-start p-2">
                  <label htmlFor="Apellido-Mat">
                    Apellido Materno
                    <br />
                  </label>
                </div>
                <div>
                  <InputText
                    {...register("Apellido_Mat", {
                      required: "Este campo es obligatorio",
                    })}
                    placeholder="Apellido Materno"
                    style={{ width: "100%" }}
                    className={errors["Apellido-Mat"] ? "p-invalid" : ""}
                  />
                  {errors.Apellido_Mat && (
                    <small className="p-error">
                      {errors.Apellido_Mat.message}
                    </small>
                  )}
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div className="p-field text-start p-2">
                  <label htmlFor="Telefono">Teléfono</label>
                </div>
                <div>
                  <InputMask
                    id="Telefono"
                    value={telefono}
                    {...register("Telefono", {
                      required: "Este campo es obligatorio",
                    })}
                    mask="(99) 9999 9999"
                    unmask={true}
                    placeholder="(55) 6789 5432"
                    onChange={handleTelefonoChange}
                    style={{ width: "100%" }}
                    className={errors["Telefono"] ? "p-invalid" : ""}
                  />
                  {errors["Telefono"] && (
                    <small className="p-error">
                      {errors["Telefono"].message}
                    </small>
                  )}
                </div>
                <div className="p-field text-start p-2">
                  <label htmlFor="Correo">
                    Correo
                    <br />
                  </label>
                </div>
                <div>
                  <InputText
                    {...register("Correo", {
                      required: "Este campo es obligatorio",
                      pattern: {
                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*\.\w{2,}$/,
                        message: "Por favor ingresa un correo válido",
                      },
                      validate: {
                        isUdaDomain: (value) =>
                          /@uda\.edu\.mx$/.test(value) ||
                          "El correo debe ser del dominio '@uda.edu.mx'",
                      },
                    })}
                    placeholder="Correo"
                    style={{ width: "100%" }}
                    className={errors["Correo"] ? "p-invalid" : ""}
                  />
                  {errors["Correo"] && (
                    <small className="p-error">
                      {errors["Correo"].message}
                    </small>
                  )}
                </div>
              </Col>
            </Row>
            <div className="p-field text-end">
              <Link to="/Land">
                <Button
                  label="Cancelar"
                  className=" p-button-rounded p-button-lg p-mt-2 mx-2"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "#EE5253",
                    color: "black",
                  }}
                />
              </Link>
              <Button
                label="Confirmar"
                onClick={handleSubmit(onSubmit)}
                className=" p-button-rounded p-button-lg p-mt-2 mx-2"
                style={{ backgroundColor: "#EE5253", borderColor: "none" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CrearLider;
