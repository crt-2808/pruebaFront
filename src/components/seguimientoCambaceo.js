import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";
import usuarioAnon from "../img/imagen-de-usuario-con-fondo-negro.png";
import Swal from "sweetalert2";
import "../theme.css";
import "primereact/resources/primereact.css"; // core css

const SeguimientoCambaceo = () => {
  const navigate = useNavigate();
  const options = {
    method: "GET",
    mode: "cors",
  };

  // Nuevo estado para los datos de los colaboradores
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const colab = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/colaborador",
        options
      );
      const data = await response.json();

      // Transformamos la data si es necesario
      const transformedData = data.map((item) => {
        if (item.Imagen === "src") {
          return { ...item, Imagen: usuarioAnon };
        }
        return item;
      });
      setData(transformedData);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Algo salió mal al cargar los colaboradores!",
      });
    }
  };
  const handleClick = (type, colaborador) => {
    Swal.fire({
      title: "Corrobora los datos",
      text: "Fecha",
      icon: "warning",
      showCancelButton: true,
      html: `
        <h3>Has seleccionado</h3>
        <div class='row centrar' style='overflow: hidden;'>
          <div class='col-md-8 col-xs-6'>
            <div class='card centrar p-3 mt-3'>
              <img src='${colaborador.Imagen}' class='img-fluid' id='img-card'>
              <h3>${colaborador.Nombre}</h3>
              <h4>${
                colaborador.Apellido_pat + " " + colaborador.Apellido_mat
              }</h4>
              <h6>${colaborador.Correo}</h6>
              <h6>${colaborador.Telefono}</h6>
            </div>
          </div>
        </div>
        <br>
        <h3>Para un seguimiento <span class="text-danger">${type}</span></h3>
      `,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ea4335",
      cancelButtonColor: "#333333",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/SeguimientoCambaceo/${type}/${colaborador.ID_Colab}`);
      }
    });
  };

  useEffect(() => {
    colab();
  }, []);
  useEffect(() => {
    const filteredColab = data.filter((colaborador) =>
      colaborador.Nombre.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filteredColab);
  }, [search, data]);
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="fluid">
      <Navbar></Navbar>
      <div className="Colab">
        <div className="container-fluid px-4">
          <div className="row table_space mt-4">
            <div className="col-md-12 d-flex justify-content-center align-items-center mb-3">
              <Link to="/cambaceo">
                <ArrowLeft className="ml-4 regreso" />
                <span id="indicador">Cambaceo</span>
              </Link>
            </div>
          </div>
          <div className="col-12 mt-5 mb-md-1 mb-sm-0 px-4">
            <h1 className="textoSeguimiento mx-md-5 mx-sm-1">Seguimiento</h1>
          </div>
          <div
            className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4"
            id="contenedor"
          >
            <div className="row">
              <div className="col-md-6">
                <h6 className="textoBuscaSeg">
                  Selecciona al colaborador<br></br>y el tipo de seguimiento
                </h6>
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por Nombre"
                  aria-label="Buscar"
                  aria-describedby="basic-addon1"
                  value={search}
                  onChange={handleSearchChange}
                ></input>
              </div>
            </div>
            <div
              className="row align-items-center mt-sm-4 mb-sm-4 mt-md-0 mb-md-0"
              id="opcionesCambaceo"
            >
              <div className="container-fluid mt-5 mb-2">
                <div className="row px-2 gy-4" id="Resultado">
                  {filteredData.length > 0 ? (
                    filteredData.map((colaborador, index) => (
                      <div className="col-md-3 " key={index}>
                        <div className="card centrar p-3">
                          <img
                            src={colaborador.Imagen}
                            className="img-fluid"
                            id="img-card"
                            alt="imagen de colaborador"
                          />
                          <h3>{colaborador.Nombre}</h3>
                          <h4>
                            {colaborador.Apellido_pat +
                              " " +
                              colaborador.Apellido_mat}
                          </h4>
                          <h6 className="email">{colaborador.Correo}</h6>
                          <h6>{colaborador.Telefono}</h6>
                          <div className="col-md-12">
                            <div className="row">
                              <div className="col-md-12">
                                <button
                                  className="btnDiario"
                                  onClick={() =>
                                    handleClick("Diario", colaborador)
                                  }
                                >
                                  Diario
                                </button>
                                <button
                                  className="btnSemanal"
                                  onClick={() =>
                                    handleClick("Semanal", colaborador)
                                  }
                                >
                                  Semanal
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>
                      No se encontró ningún colaborador con el nombre "{search}
                      ".
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SeguimientoCambaceo;
