import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";

const NotFound = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate(-2);
    }, 7000);

    return () => clearTimeout(timeoutId);
  }, [navigate]);

  return (
    <div>
      <div className="fluid color-land">
        <Navbar></Navbar>
        <div className="container land pt-4 pb-4  d-flex" id="landing-p">
          <div className="row w-100">
            <div className="col-12 mt-2 mb-md-3 mb-sm-0"></div>

            <h1>404 - Página no encontrada</h1>
            <p>La página que estás buscando no existe.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
