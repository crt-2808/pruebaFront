import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../userProvider";
import Navbar from "./navbar";
import Agregar from "../img/Agregar.png";
import Editar from "../img/boton-editar.png";
import Planeador from "../img/Planeador.png";
const upperCaseFirstLetter = (string) =>
  `${string.slice(0, 1).toUpperCase()}${string.slice(1)}`;

const lowerCaseAllWordsExceptFirstLetters = (string) =>
  string.replaceAll(
    /\S*/g,
    (word) => `${word.slice(0, 1)}${word.slice(1).toLowerCase()}`
  );

// const nombreUsuario = upperCaseFirstLetter(
//   lowerCaseAllWordsExceptFirstLetters(usuario.givenName)
// );

const Land = () => {
  const { toggleUser, usuario } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    // console.log(usuario.name);
    if (usuario == null || usuario == undefined) {
      navigate("/");
    }

    const options = {
      method: "GET",
      mode: "cors",
    };

    // const lider = async () => {

    //   try {
    //     const response = await fetch(
    //       `http://localhost:3001/api/colaborador/${usuario.googleId}`,
    //       options
    //     );
    //     const data = await response.json();
    //     console.log(data);
    //     const liderData = usuario + data;
    //     toggleUser(liderData);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
  }, []);

  return (
    <div className="fluid color-land">
      <Navbar></Navbar>
      <div className="container land pt-4 pb-4  d-flex" id="landing-p">
        {/* <div className="content">
          <div className="container-fluid p-0">
            <div className="row" id="card">
              {usuario ? (
                <div className="row centrar titulo-land">
                  <div className="col-md-7">
                    <h2 className="tituloLand">¿Qué deseas hacer?</h2>
                  </div>
                </div>
              ) : (
                <h1>Nada</h1>
              )}
              <div className="row centrar opciones-land centrar">
                <div className="col-md-3">
                  <Link to="/agregarColab">
                    <button className="boton_agregar">Agregar</button>
                  </Link>
                </div>
                <div className="col-md-3">
                  <Link to="/editarColab">
                    <button className="boton_agregar">Editar</button>
                  </Link>
                </div>
                <div className="col-md-3">
                  <Link to="/Planeador">
                    <button className="boton_agregar">Planeador</button>
                  </Link>
                </div>
                <div className="col-md-6 completo-v">
                  <div className="row completo-v ">
                    <div className="col-md-12 centrar">
                      <h4>Colaborador</h4>
                    </div>
                    <div className="col-md-6 completo-v">
                      <img alt="Boton Agregar" src={Agregar}></img>
                      <button className="boton_agregar">Agregar</button>
                    </div>
                    <div className="col-md-6 completo-v">
                      <img alt="Boton Agregar" src={Editar}></img>
                      <button className="boton_agregar">Editar</button>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 completo-v">
                  <div className="row completo-v">
                    <div className="col-md-12 centrar">
                      <h4>Planeador</h4>
                    </div>
                    <div className="col-md-12 flex-column">
                      <img alt="Boton Agregar" src={Planeador}></img>
                      <button className="boton_agregar">Entrar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div className="row w-100">
          <div className="col-12 mt-2 mb-md-3 mb-sm-0">
            <h1 className="bienvenidoText">
              Bienvenido &nbsp;
              {upperCaseFirstLetter(
                lowerCaseAllWordsExceptFirstLetters(usuario.givenName)
              )}
            </h1>
          </div>

          <div className="col-12 mt-4 p-0">
            <div className="container-fluid mt-2 mb-4 p-5" id="contenedor-land">
              <div className="row">
                <div className="col-12">
                  <h2 className="tituloLand">¿Qué deseas hacer?</h2>
                </div>
              </div>
              <div className="row pt-md-5 mt-md-4 pb-md-4 mb-md-3">
                <div className="col-md-6">
                  <div className="row no-padding">
                    <div className="col-12">
                      <h4 className="subTituloLand">Colaborador</h4>
                    </div>
                    <div className="col-12">
                      <div className="row no-padding pt-5 pl-0 pr-0">
                        <div className="col-md-6 ">
                          <Link to="/agregarColab" className="no-decoration">
                            <img src={Agregar} alt="Boton-Agregar"></img>
                            <p className="placeBtn">Agregar</p>
                          </Link>
                        </div>
                        <div className="col-md-6">
                          <Link to="/editarColab" className="no-decoration">
                            <img src={Editar} alt="Boton-Editar"></img>
                            <p className="placeBtn">Editar</p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="subTituloLand">Planeador</h4>
                    </div>
                    <div className="col-12">
                      <div className="row pt-5">
                        <div className="col-md-12">
                          <Link to="/planeador" className="no-decoration">
                            <img src={Planeador} alt="Boton-Editar"></img>
                            <p className="placeBtn">Entrar</p>
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
    </div>
  );
};

export default Land;
