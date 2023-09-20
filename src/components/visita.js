import React from "react";
import Navbar from "./navbar";
import { Link } from "react-router-dom";



const styles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

const Visita = () => {
  return(<div className="fluid">
  <Navbar></Navbar>
  <div  className="row" style={styles}>
    <div className="col-md-3">
      <Link to="/CalendarioVisita">
        <button className="boton_agregar">Calendario</button>
      </Link>
    </div>
    <div className="col-md-3">
      <Link to="/">
        <button className="boton_agregar">Editar</button>
      </Link>
    </div>
    <div className="col-md-3">
      <Link to="/SeguimientoVisita">
        <button className="boton_agregar">Seguimiento</button>
      </Link>
    </div>
    <div className="col-md-3">
      <Link to="/land">
        <button className="boton_agregar">
          Menu
        </button>
      </Link>
    </div>
  </div>
</div>);
};

export default Visita;
