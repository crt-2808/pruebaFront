import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import { Link } from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useParams, useLocation } from "react-router-dom";
import { fetchWithToken } from "../utils/api";
import { API_URL } from "../utils/api";

const EquipoGerente = () => {
  const { idUsuario } = useParams();
  const [membersData, setMembersData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const { gerente } = location.state || {};
  const [idGerente, setGerente] = useState([]);

  const fetchUsuarios = async (idUsuario) => {
    try {
      const url = `${API_URL}/usuariosPorRol?idUsuario=${idUsuario}`;
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
    if (idUsuario) {
      fetchUsuarios(idUsuario);
      setGerente(idUsuario);
    }
  }, [idUsuario]);

  // Agrupa los miembros por rol y filtra por el término de búsqueda
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

  return (
    <div className="fluid">
      <Navbar />
      <div className="Colab">
        <div className="container-fluid px-4">
          <div className="row table_space mt-4">
            <div className="col-md-12 d-flex justify-content-center align-items-center mb-3">
              <Link to="/Equipos">
                <ArrowLeft className="ml-4 regreso" />
                <span id="indicador">Equipos</span>
              </Link>
            </div>
          </div>
          <div
            className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4"
            id="contenedor"
          >
            <div className="row align-items-center">
              <div className="col-md-6 d-flex align-items-center">
                {gerente?.Imagen && (
                  <img
                    src={gerente.Imagen}
                    alt={`${gerente.Nombre} ${gerente.Apellido_pat} ${gerente.Apellido_mat}`}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: "1rem",
                    }}
                  />
                )}
                <h5 style={{ margin: 0 }}>
                  {`${gerente.Nombre} ${gerente.Apellido_pat} ${gerente.Apellido_mat}`}{" "}
                  - Usuarios a su cargo
                </h5>
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
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar"
                            className="w-100"
                          />
                        </div>
                      </div>
                      <div className="col-md-6 col-6">
                        <Link
                          to={{
                            pathname: "/agregarColab",
                            state: { idGerente: idGerente }
                          }}
                        >
                          <Button
                            className="d-none d-sm-inline-flex"
                            label="Crear Usuario"
                            icon="pi pi-plus"
                            severity="Danger"
                            style={{ marginLeft: "2rem" }}
                          />
                          <Button
                            className="d-inline-flex d-sm-none"
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
              {/* Coordinadores */}
              {groupedMembers.coordinadores.length > 0 ? (
                <>
                  <h4>Coordinador</h4>
                  <hr />
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
                </>
              ) : null}

              {/* Asesores */}
              {groupedMembers.asesores.length > 0 ? (
                <>
                  <h4>Asesor</h4>
                  <hr />
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
                </>
              ) : null}

              {groupedMembers.coordinadores.length === 0 &&
                groupedMembers.asesores.length === 0 && (
                  <p>No hay miembros asignados</p>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipoGerente;
