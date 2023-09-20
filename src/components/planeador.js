import React from "react";
import Navbar from "./navbar";
import { Link } from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";
import Cambaceo from "../img/Cambaceo.png";
import Visita from "../img/Visita.png";
import Llamada from "../img/Llamada.png";

const Planeador = () => {
  return (
    <div className="fluid">
      <Navbar></Navbar>
      <Link to="/land">
        <ArrowLeft className="ml-4 regreso" />
        <span id="indicador">Inicio</span>
      </Link>

      <div className="col-12  todo">
        <div
          className="container mt-sm-5 mt-md-2 mb-4 p-5"
          id="contenedor-land"
        >
          <div className="row">
            <div className="col-12 text-left">
              <h2 className="tituloPlaneador">Planeador</h2>
            </div>
          </div>
          <div className="row pt-md-3  pb-md-4 mb-md-3">
            <div className="col-md-12">
              <div className="row no-padding">
                <div className="col-12">
                  <div className="row no-padding pt-5 pl-0 pr-0">
                    <div className="col-md-4 ">
                      <Link to="/Cambaceo" className="no-decoration">
                        <img
                          className="imgPlaneador"
                          src={Cambaceo}
                          alt="Cambaceo"
                        ></img>
                        <button className="btnPlaneador">Cambaceo</button>
                      </Link>
                    </div>
                    <div className="col-md-4">
                      <Link to="/VisitaProgramada" className="no-decoration">
                        <img
                          className="imgPlaneador"
                          src={Visita}
                          alt="Visita programada"
                        ></img>
                        <button className="btnPlaneador">
                          Visita programada
                        </button>
                      </Link>
                    </div>
                    <div className="col-md-4">
                      <Link to="/Llamada" className="no-decoration">
                        <img
                          className="imgPlaneador"
                          src={Llamada}
                          alt="Llamada"
                        ></img>
                        <button className="btnPlaneador">Llamada</button>
                      </Link>
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
};

export default Planeador;
