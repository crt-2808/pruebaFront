import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import { ArrowLeft } from "react-bootstrap-icons";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Checkbox } from "primereact/checkbox";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";


function SeleccionColaboradores() {
  const [selectedColaboradores, setSelectedColaboradores] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const colaboradoresData = [
    { id: 1, nombre: "Colaborador 1", puesto: "Puesto 1" },
    { id: 2, nombre: "Colaborador 2", puesto: "Puesto 2" },
    { id: 3, nombre: "Colaborador 3", puesto: "Puesto 3" },
    // Agrega más colaboradores si es necesario
  ];

  const onCheckboxChange = (e) => {
    const checked = e.checked;
    const colabId = e.value.id;
    if (checked) {
      setSelectedColaboradores([...selectedColaboradores, colabId]);
    } else {
      setSelectedColaboradores(selectedColaboradores.filter(id => id !== colabId));
    }
  };

  const confirmar = () => {
    setShowConfirmDialog(true);
  };

  const cancelar = () => {
    setShowConfirmDialog(false);
  };

  const confirmarAccion = () => {
    // Lógica para realizar la acción confirmada...
    setShowConfirmDialog(false);
  };

  return (
    <div className="fluid">
      <Navbar />
      <div className="Colab">
        <div className="container-fluid px-4">
          {/* Resto del código... */}
          <div
            className="row align-items-center mt-sm-4 mb-sm-4 justify-content-around"
            id="opcionesCambaceo"
          >
            {/* Agregar la DataTable y Checkbox aquí */}
            <DataTable value={colaboradoresData}>
              <Column
                headerStyle={{ width: "3rem" }}
                bodyStyle={{ textAlign: "center" }}
                body={(rowData) => (
                  <Checkbox
                    checked={selectedColaboradores.includes(rowData.id)}
                    onChange={onCheckboxChange}
                    value={rowData}
                  />
                )}
              />
              <Column field="id" header="ID" />
              <Column field="nombre" header="Nombre" />
              <Column field="puesto" header="Puesto" />
            </DataTable>
          </div>
          <div className="row justify-content-center mt-4">
            <Button onClick={confirmar} label="Confirmar" className="p-button-success" />
          </div>
        </div>
      </div>

      <ConfirmDialog
        visible={showConfirmDialog}
        onHide={cancelar}
        message="¿Deseas continuar?"
        header="Confirmar Acción"
        icon="pi pi-exclamation-triangle"
        footer={
          <div>
            <Button label="Cancelar" className="p-button-text" onClick={cancelar} />
            <Button
              label="Confirmar"
              className="p-button-danger"
              onClick={confirmarAccion}
            />  
          </div>
        }
      />
    </div>
  );
}

export default SeleccionColaboradores;
