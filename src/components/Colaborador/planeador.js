import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../../userProvider";
import Navbar from "../navbar";
import Planeador from "../../img/Planeador.png";
import { useAuthRedirect } from "../../useAuthRedirect";
import axios from "axios";
import { ArrowLeft } from "react-bootstrap-icons";
import Cambaceo from "../../img/Cambaceo.png";
import Visita from "../../img/Visita.png";
import Llamada from "../../img/Llamada.png";

  const Planeador_Colab = () => {
  useAuthRedirect();
  const { toggleUser, usuario } = useUserContext();
  console.log(usuario);
  useEffect(() => {
    const options = {
      method: "GET",
      mode: "cors",
    };
  }, []);  
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
                      <div className="col-md-12">
                        <Link to="/cambaceo" className="no-decoration">
                          <div className="col-md-12">
                            <img
                              className="imgPlaneador"
                              src={Cambaceo}
                              alt="Cambaceo"
                            ></img>
                          </div>
                          <div className="col-md-12">
                            <button className="btnPlaneador">Cambaceo</button>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="col-md-12">
                        <Link to="/visitaProgramada" className="no-decoration">
                          <div className="col-md-12">
                            <img
                              className="imgPlaneador"
                              src={Visita}
                              alt="Visita programada"
                            ></img>
                          </div>
                          <div className="col-md-12">
                            <button className="btnPlaneador">
                              Visita programada
                            </button>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="col-md-12">
                        <Link to="/llamada" className="no-decoration">
                          <div className="col-md-12">
                            <img
                              className="imgPlaneador"
                              src={Llamada}
                              alt="Llamada"
                            ></img>
                          </div>
                          <div className="col-md-12">
                            <button className="btnPlaneador">Llamada</button>
                          </div>
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
    </div>
  );
};

export default Planeador_Colab;