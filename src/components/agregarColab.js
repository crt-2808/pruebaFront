import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import Navbar from "./navbar";
import { ArrowLeft } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthRedirect } from "../useAuthRedirect";
import { API_URL, fetchWithToken } from "../utils/api";
import { Checkbox } from "primereact/checkbox";
import { Message } from "primereact/message";
import { useLocation } from "react-router-dom"; // Importar useLocation

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

    return data.existe;
  } catch (error) {
    console.error("Error checking correo:", error);
    return false;
  }
};

function AgregarColab() {
  const [message, setMessage] = useState("");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const idGerente = params.get("idGerente");

  useAuthRedirect();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const navigate = useNavigate();
  const formData = new FormData();
  const roles = [
    { label: "Gerente", value: "gerente" },
    { label: "Colaborador", value: "colaborador" },
    { label: "Coordinador", value: "coordinador" },
  ];
  const [assignToAnother, setAssignToAnother] = useState(false);
  const [isCoordinadorOColaborador, setIsCoordinadorOColaborador] =
    useState(false);
  const [gerentes, setGerentes] = useState([]);
  const [liderID, setLiderID] = useState("");
  const [disableGerente, setDisableGerente] = useState(false);
  const [showAssignAnother, setShowAssignAnother] = useState(true);

  useEffect(() => {
    if (idGerente) {
      setDisableGerente(true);
      setMessage(`Se agregará el líder con ID: ${idGerente}`);
      setShowAssignAnother(false);
    } else {
      setDisableGerente(false);
      setShowAssignAnother(true);
    }
  }, [idGerente]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetchWithToken(`${API_URL}/usuariosPorRol`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();

          const gerentes = data.filter((user) => user.Rol === "gerente");
          setGerentes(gerentes);
        } else {
          console.error("Error fetching usuarios:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);

  const onSubmit = async (data) => {
    if (!data) {
      return Swal.fire({
        icon: "error",
        title: "Se requiere llenar el formulario",
        text: "Por favor, completa todos los campos.",
        timer: 1200,
        timerProgressBar: true,
        backdrop: `
          rgba(36,32,32,0.65)
        `,
      });
    }

    Swal.fire({
      title: "Cargando...",
      text: "Por favor espera un momento",
      allowOutsideClick: false,
    });
    Swal.showLoading();

    const correoExists = await checkIfCorreoExists(data.Correo);
    console.log("Correo exists:", correoExists);
    if (correoExists) {
      Swal.close();
      return Swal.fire({
        icon: "error",
        title: "El correo ya está tomado",
        text: "Por favor, ingresa un correo diferente.",
      });
    }

    const inputElem = document.getElementById("FotoColab");
    const file = inputElem.files[0];
    if (file) {
      const blob = file.slice(0);
      const imagen = new File([blob], `${file.name}`);
      data = { ...data, FotoColab: imagen };
      formData.append("FotoColab", imagen);
    }

    if (liderID) {
      formData.append("liderID", liderID);
    }

    if (idGerente) {
      formData.append("liderID", idGerente);
    }

    formData.append("Nombre", data.Nombre);
    formData.append("Apellido_pat", data.Apellido_pat);
    formData.append("Apellido_mat", data.Apellido_mat);
    formData.append("Correo", data.Correo);
    formData.append("Telefono", data.Telefono);
    formData.append("Rol", data.Rol);

    let config = {
      method: "POST",
      body: formData,
    };
    try {
      let res = await fetchWithToken(`${API_URL}/createColaborador`, config);
      Swal.close();
      if (!res.ok) {
        throw new Error("Failed to create colaborador");
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
        if (idGerente) {
          navigate(-1);
        } else {
          navigate("/land");
        }
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
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

  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    setIsCoordinadorOColaborador(
      selectedRole === "coordinador" || selectedRole === "colaborador"
    );
  };

  const handleAssignToAnotherChange = (event) => {
    setAssignToAnother(event.checked);
  };

  const handleGerenteSeleccionadoChange = (event) => {
    setLiderID(event.target.value);
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
          <Link to={idGerente ? -1 : "/Land"}>
            <ArrowLeft className="ml-4 regreso" />
            <span style={{ marginBottom: "100px" }} id="indicador">
              {idGerente ? "Regresar al gerente" : "Menu Principal"}
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
          {message && (
            <Message
              severity="info"
              text={message}
              style={{ marginBottom: "1rem" }}
            />
          )}
        </div>

        <div
          className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-5 mt-md-4 "
          id="contenedor-cambaceo"
        >
          <Form onSubmit={handleSubmit(onSubmit)} method="post" id="form">
            <Row className="mb-5">
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Rol</Form.Label>
                  <Form.Select
                    {...register("Rol", { required: true })}
                    onChange={handleRoleChange}
                  >
                    <option value="" disabled>
                      Selecciona un rol
                    </option>
                    {roles
                      .filter(
                        (role) => !(idGerente && role.value === "gerente")
                      )
                      .map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                  </Form.Select>

                  {errors.Rol && <p>Este campo es requerido</p>}
                </Form.Group>

                <br />
                <Form.Group controlId="ColbID">
                  <Form.Label>ColabID</Form.Label>
                  <Form.Control
                    type="string"
                    {...register("ID_Colab", { required: true })}
                    placeholder="Ingresa el ID"
                  />
                  {errors.ID_Colab && <p>Este campo es requerido</p>}
                </Form.Group>
                <br />
                <Form.Group>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="string"
                    {...register("Nombre", { required: true })}
                    placeholder="Ingresa el nombre"
                  />
                  {errors.Nombre && <p>Este campo es requerido</p>}
                </Form.Group>
                <br />
                <Form.Group>
                  <Form.Label>Apellido Paterno</Form.Label>
                  <Form.Control
                    type="string"
                    {...register("Apellido_pat", { required: true })}
                    placeholder="Ingresa el apellido"
                  />
                  {errors.Apellido_pat && <p>Este campo es requerido</p>}
                </Form.Group>
                <br />
                <Form.Group>
                  <Form.Label>Apellido Materno</Form.Label>
                  <Form.Control
                    type="string"
                    {...register("Apellido_mat", { required: true })}
                    placeholder="Ingresa el apellido"
                  />
                  {errors.Apellido_mat && <p>Este campo es requerido</p>}
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
                  {errors.Correo && <p>Este campo es requerido</p>}
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
                  {errors.Telefono && <p>Este campo es requerido</p>}
                  {errors.Telefono?.type === "pattern" && (
                    <p>El formato del telefono no es valido</p>
                  )}
                </Form.Group>
                <br />

                <br />

                <Form.Group controlId="FotoColab" className="mb-3">
                  <Form.Label>Imagen (opcional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp"
                    {...register("FotoColab")}
                  />
                  {errors.FotoColab && <p>Este campo es requerido</p>}
                </Form.Group>
                <br />
                {isCoordinadorOColaborador && showAssignAnother && (
                  <Form.Group>
                    <Checkbox
                      inputId="assignToAnother"
                      checked={assignToAnother}
                      onChange={handleAssignToAnotherChange}
                    />
                    <Form.Label htmlFor="assignToAnother">
                      ¿Asignar a otro gerente?
                    </Form.Label>
                    {assignToAnother && (
                      <Form.Group>
                        <Form.Label>Selecciona un gerente</Form.Label>
                        <Form.Control
                          as="select"
                          {...register("liderID", {
                            required: assignToAnother,
                          })}
                          onChange={handleGerenteSeleccionadoChange}
                        >
                          <option value="">Selecciona un gerente</option>
                          {gerentes.map((gerente) => (
                            <option
                              key={gerente.idUsuario}
                              value={gerente.idUsuario}
                            >
                              {gerente.Nombre +
                                " " +
                                gerente.Apellido_pat +
                                " " +
                                gerente.Apellido_mat}
                            </option>
                          ))}
                        </Form.Control>
                        {errors.liderID && <p>Este campo es requerido</p>}
                      </Form.Group>
                    )}
                  </Form.Group>
                )}
              </Col>
              <Col>
                <Button type="submit" variant="success" size="lg">
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
