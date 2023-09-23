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
                <span id="indicador">Menu Visita</span>
              </Link>
            </div>
          </div>
          <div
            className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4"
            id="contenedor"
          >
            <div className="row">
              <h2 className="titulo-cambaceo">Seguimiento</h2>
            </div>
            <div
              className="row align-items-center mt-sm-4 mb-sm-4 justify-content-around"
              id="opcionesCambaceo"
            >
                <div className="col-md-4">
                <Calendar
                  value={date}
                  onChange={(e) => setDate(e.value)}
                  showIcon
                />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeguimientoVisita;
