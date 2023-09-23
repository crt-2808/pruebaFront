/* 
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import { ArrowLeft } from "react-bootstrap-icons";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

function SeguimientoLlamada() {
  const telefonos = [
    {
      label: "123456789 - Ejemplo S.A.",
      value: "123456789",
      empresa: "Ejemplo S.A.",
    },
    {
      label: "987654321 - Otro Ejemplo S.A.",
      value: "987654321",
      empresa: "Otro Ejemplo S.A.",
    },
    // Agrega más números de teléfono según lo necesario
  ];

  const [telefonoSeleccionado, setTelefonoSeleccionado] = useState(null);
  const [incidencia, setIncidencia] = useState("");

  const datosTelefonos = {
    "123456789": {
      nombreCompleto: "John Doe",
      fechaAsignacion: "2023-07-21",
      fechaConclusion: "2023-07-25",
      tipoEmpresa: "Ejemplo S.A.",
    },
    "987654321": {
      nombreCompleto: "Jane Smith",
      fechaAsignacion: "2023-07-22",
      fechaConclusion: "2023-07-26",
      tipoEmpresa: "Otro Ejemplo S.A.",
    },
  };

  const handleTelefonoChange = (e) => {
    const selectedTelefono = e.value;
    setTelefonoSeleccionado(selectedTelefono);
  };

  return (
    <div className="fluid">
      <Navbar></Navbar>
      <div className="Colab">
        <div className="container-fluid px-4">
          <div className="row table_space mt-4">
            <div className="col-md-12 d-flex justify-content-center align-items-center mb-3">
              <Link to="/Llamada">
                <ArrowLeft className="ml-4 regreso" />
                <span id="indicador">Menu Llamada</span>
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
              <Dropdown
                value={telefonoSeleccionado}
                options={telefonos}
                optionLabel="label"
                placeholder="Seleccione un teléfono"
                onChange={handleTelefonoChange}
              />

              {telefonoSeleccionado && (
                <>
                  <div className="mt-4">
                    <label style={{ color: "#EB6B68" }}>Nombre Completo:</label>
                    <span>{datosTelefonos[telefonoSeleccionado].nombreCompleto}</span>
                  </div>
                  <div className="mt-4">
                    <label style={{ color: "#EB6B68" }}>Fecha de Asignación:</label>
                    <span>{datosTelefonos[telefonoSeleccionado].fechaAsignacion}</span>
                  </div>
                  <div className="mt-4">
                    <label style={{ color: "#EB6B68" }}>Fecha de Conclusión:</label>
                    <span>{datosTelefonos[telefonoSeleccionado].fechaConclusion}</span>
                  </div>
                  <div className="mt-4">
                    <label style={{ color: "#EB6B68" }}>Tipo de Empresa:</label>
                    <span>{datosTelefonos[telefonoSeleccionado].tipoEmpresa}</span>
                  </div>
                </>
              )}

              <div className="mt-4">
                <label>Incidencia:</label>
                <InputText
                  value={incidencia}
                  onChange={(e) => setIncidencia(e.target.value)}
                  disabled={!telefonoSeleccionado}
                />
              </div>

              <div className="mt-4">
                <Button
                  label="Cancelar"
                  className="p-button-danger mr-2"
                  onClick={() => {
                    setTelefonoSeleccionado(null);
                    setIncidencia("");
                  }}
                  disabled={!telefonoSeleccionado}
                />

                <Button
                  label="Actualizar"
                  className="p-button-success"
                  onClick={() => {
                    // Implementa aquí la lógica para guardar los cambios
                    // en la base de datos o realizar alguna acción de actualización
                    // Luego podrías hacer alguna acción de éxito o redirección si es necesario
                  }}
                  disabled={!telefonoSeleccionado}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeguimientoLlamada;



*/

import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import { ArrowLeft } from "react-bootstrap-icons";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import {Papa} from "papaparse";

function SeguimientoLlamada() {
  const [telefonos, setTelefonos] = useState([]);
  const [telefonoSeleccionado, setTelefonoSeleccionado] = useState(null);
  const [incidencia, setIncidencia] = useState("");
  const [datosTelefonos, setDatosTelefonos] = useState({});

  
  useEffect(() => {
    // Obtener la lista de números de teléfono desde el backend
    fetch("/api/telefonos")
      .then((response) => response.json())
      .then((data) => setTelefonos(data))
      .catch((error) =>
        console.error("Error al obtener los números de teléfono:", error)
      );
  }, []);

  useEffect(() => {
    // Obtener los datos de teléfonos seleccionados desde el backend
    if (telefonoSeleccionado) {
      fetch(`/api/telefonos/${telefonoSeleccionado}`)
        .then((response) => response.json())
        .then((data) => setDatosTelefonos(data))
        .catch((error) =>
          console.error("Error al obtener los datos del teléfono:", error)
        );
    } else {
      setDatosTelefonos({});
    }
  }, [telefonoSeleccionado]);

  const handleTelefonoChange = (e) => {
    const selectedTelefono = e.value;
    setTelefonoSeleccionado(selectedTelefono);
  };

  const handleCancelar = () => {
    setTelefonoSeleccionado(null);
    setIncidencia("");
  };

  const handleActualizar = () => {
    // Lógica para guardar la incidencia en el backend
    // Puedes enviar incidencia y datosTelefonos al backend para procesarlos
    // Después de guardar, puedes hacer alguna acción de éxito o redirección si es necesario
  };
  const handleExportar = () => {
    if (!telefonoSeleccionado) {
      return;
    }

    const csvData = [
      ["Nombre Completo", "Fecha de Asignación", "Fecha de Conclusión", "Tipo de Empresa", "Incidencia"],
      [datosTelefonos.nombreCompleto, datosTelefonos.fechaAsignacion, datosTelefonos.fechaConclusion, datosTelefonos.tipoEmpresa, incidencia],
    ];
  const csv = Papa.unparse(csvData);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "Lista de Llamadas.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
  return (
    <div className="fluid">
      <Navbar />
      <div className="Colab">
        <div className="container-fluid px-4">
          <div className="row table_space mt-4">
            <div className="col-md-12 d-flex justify-content-center align-items-center mb-3">
              <Link to="/Llamada">
                <ArrowLeft className="ml-4 regreso" />
                <span id="indicador">Menu Llamada</span>
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
              <Dropdown
                value={telefonoSeleccionado}
                options={telefonos}
                optionLabel="label"
                placeholder="Seleccione un teléfono"
                onChange={handleTelefonoChange}
              />

              {telefonoSeleccionado && (
                <>
                  <div className="mt-4">
                    <label style={{ color: "#EB6B68" }}>Nombre Completo:</label>
                    <span>{datosTelefonos.nombreCompleto}</span>
                  </div>
                  <div className="mt-4">
                    <label style={{ color: "#EB6B68" }}>
                      Fecha de Asignación:
                    </label>
                    <span>{datosTelefonos.fechaAsignacion}</span>
                  </div>
                  <div className="mt-4">
                    <label style={{ color: "#EB6B68" }}>
                      Fecha de Conclusión:
                    </label>
                    <span>{datosTelefonos.fechaConclusion}</span>
                  </div>
                  <div className="mt-4">
                    <label style={{ color: "#EB6B68" }}>Tipo de Empresa:</label>
                    <span>{datosTelefonos.tipoEmpresa}</span>
                  </div>
                </>
              )}

              <div className="mt-4">
                <label>Incidencia:</label>
                <InputText
                  value={incidencia}
                  onChange={(e) => setIncidencia(e.target.value)}
                  disabled={!telefonoSeleccionado}
                />
              </div>

              <div className="mt-4">
                <Button
                  label="Cancelar"
                  className="p-button-danger mr-2"
                  onClick={handleCancelar}
                  disabled={!telefonoSeleccionado}
                />
                <Button
                  label="Actualizar"
                  className="p-button-success"
                  onClick={handleActualizar}
                  disabled={!telefonoSeleccionado}
                />
                <Button
                  label="Exportar"
                  className="p-button-info"
                  onClick={handleExportar}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeguimientoLlamada;
