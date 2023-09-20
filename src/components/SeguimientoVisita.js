import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import { ArrowLeft } from "react-bootstrap-icons";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";

function SeguimientoVisita() {
  const [date, setDate] = useState(null); // Estado para manejar la fecha seleccionada
  return (
    <div className="fluid">
      <Navbar></Navbar>
      <div className="Colab">
        <div className="container-fluid px-4">
          <div className="row table_space mt-4">
            <div className="col-md-12 d-flex justify-content-center align-items-center mb-3">
              <Link to="/VisitaProgramada">
                <ArrowLeft className="ml-4 regreso" />
                <span id="indicador">Cambaceo</span>
              </Link>
            </div>
          </div>
          <div className="col-12 mt-5 mb-md-1 mb-sm-0 px-4">
            <h1 className="textoSeguimiento mx-md-5 mx-sm-1">
              Seguimiento Visita
            </h1>
          </div>
          <div
            className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4"
            id="contenedor"
          >
            <div className="row">
              <div className="col-md-6">
                <h6 className="textoBuscaSeg">
                  Selecciona la visita<br></br>para ver el seguimiento
                </h6>
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre de la persona a visitar"
                  aria-label="Buscar"
                  aria-describedby="basic-addon1"
                  // value={search}
                  // onChange={handleSearchChange}
                ></input>
              </div>
            </div>
            <div
              className="row align-items-center mt-sm-4 mb-sm-4 mt-md-0 mb-md-0"
              id="opcionesCambaceo"
            >
              <div className="container-fluid mt-5 mb-2">
                <div className="row px-2 gy-4" id="Resultado">
                  <div className="col-md-4 px-4">
                    <div className="visita-card   centrar p-3">
                      <h5>Nombre de la persona a visitar</h5>
                      <h5>Nombre de la empresa</h5>
                      <h5>Web de la empresa</h5>
                      <h5>Calle</h5>
                      <button className="btn-regreso">Ver</button>
                    </div>
                  </div>
                  <div className="col-md-4 px-4">
                    <div className="visita-card   centrar p-3">
                      <h5>Nombre de la persona a visitar</h5>
                      <h5>Nombre de la empresa</h5>
                      <h5>Web de la empresa</h5>
                      <h5>Calle</h5>
                      <button className="btn-regreso">Ver</button>
                    </div>
                  </div>
                  <div className="col-md-4 px-4">
                    <div className="visita-card   centrar p-3">
                      <h5>Nombre de la persona a visitar</h5>
                      <h5>Nombre de la empresa</h5>
                      <h5>Web de la empresa</h5>
                      <h5>Calle</h5>
                      <button className="btn-regreso">Ver</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeguimientoVisita;
