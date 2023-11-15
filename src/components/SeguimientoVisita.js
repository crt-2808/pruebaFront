import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import { ArrowLeft } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import Swal from "sweetalert2";

function SeguimientoVisita() {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [incidencia, setIncidencia] = useState("");
  const [isIncidenciaValid, setIsIncidenciaValid] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchData();
    setIsIncidenciaValid(incidencia.trim() !== "");
  }, [incidencia]);

  const fetchData = () => {
    axios
      .get("https://sarym-production-4033.up.railway.app/api/visitaProgramada")
      .then((response) => setData(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  const showDialog = (item) => {
    setSelectedItem(item);
    setIncidencia(item.Incidentes);
    setVisible(true);
  };

  const hideDialog = () => {
    setSelectedItem(null);
    setIncidencia("");
    setVisible(false);
  };

  const agregarIncidencia = () => {
    axios
      .put(
        `https://sarym-production-4033.up.railway.app/api/planeador/${selectedItem.ID}`,
        { incidencia }
      )
      .then((response) => {
        console.log(response.data.message);
        hideDialog();
        Swal.fire({
          icon: "success",
          title: "Incidencia registrada correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchData(); // Actualizar datos después de agregar incidencia
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        hideDialog();
        Swal.fire({
          icon: "error",
          title: "Hubo un error al registrar la incidencia",
          text: "Por favor, intenta de nuevo",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  const cardFooter = (item) => (
    <span>
      <Button label="Ver" onClick={() => showDialog(item)} />
    </span>
  );

  const renderCards = () => {
    return data.map((item) => (
      <div key={item.ID}>
        <Card
          title={item.TipoEmpresa}
          subTitle={item.FechaAsignacion}
          footer={cardFooter(item)}
          style={{ width: "300px", margin: "10px" }}
        >
          <div>{item.Direccion_Calle}</div>
        </Card>
      </div>
    ));
  };

  return (
    <div className="fluid">
      <Navbar style={{ backgroundColor: "##F8F9FA" }}></Navbar>

      <div style={{ backgroundColor: "#F1F5F8" }}>
        <div
          style={{
            paddingTop: "10px",
            paddingBottom: "10px",
            backgroundColor: "#F1F5F8",
          }}
        >
          <Link to="/VisitaProgramada">
            <ArrowLeft className="ml-4 regreso" />
            <span style={{ marginBottom: "100px" }} id="indicador">
              Menu Visita
            </span>
          </Link>
        </div>
      </div>
      <div className="py-md-4" style={{ backgroundColor: "#F1F5F8" }}>
        <div
          className="row"
          style={{
            marginLeft: "35px",
            marginBottom: "-50px",
            marginRight: "0px",
          }}
        >
          <h2 className="titulo-cambaceo px-5 ">Seguimiento Visita</h2>
        </div>

        <div
          className="container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-4"
          id="contenedor-cambaceo"
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
            }}
          >
            {renderCards()}

            <Dialog
              header={`Visita - ${
                selectedItem ? selectedItem.FechaAsignacion : ""
              }`}
              visible={visible}
              onHide={hideDialog}
              breakpoints={{ "960px": "75vw", "640px": "100vw" }}
              style={{ width: "75vw" }} // Ancho inicial, ajusta según tus necesidades
            >
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-4">
                    <label>Nombre:</label>
                    <br />
                    <input
                      type="text"
                      value={selectedItem ? selectedItem.NombreCompleto : ""}
                      disabled
                    />
                    <br />

                    <label>Empresa:</label>
                    <br />
                    <input
                      type="text"
                      value={selectedItem ? selectedItem.TipoEmpresa : ""}
                      disabled
                    />
                    <br />
                  </div>
                  <div className="col-md-4">
                    <label>Telefono:</label>
                    <br />
                    <input
                      type="text"
                      value={selectedItem ? selectedItem.Telefono : ""}
                      disabled
                    />
                    <br />

                    <label>Sitio Web:</label>
                    <br />
                    <input
                      type="text"
                      value={selectedItem ? selectedItem.Sitioweb : ""}
                      disabled
                    />
                    <br />

                    {/* Este no quedo bien */}
                    <div className="row">
                      <label>Direccion:</label>
                      <input
                        type="text"
                        value={
                          selectedItem
                            ? selectedItem.Direccion_Calle +
                              ", " +
                              selectedItem.Direccion_Num_Ext +
                              ", " +
                              selectedItem.Direccion_Num_Int +
                              ", " +
                              selectedItem.Direccion_Colonia +
                              ", " +
                              selectedItem.Direccion_CP
                            : ""
                        }
                        disabled
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mt-2">
                    <label>Descripcion:</label>
                    <textarea
                      value={selectedItem ? selectedItem.Descripcion : ""}
                      disabled
                      rows={2}
                      style={{ width: "100%" }}
                    />

                    <label>Incidencia:</label>
                    <textarea
                      value={incidencia}
                      onChange={(e) => setIncidencia(e.target.value)}
                      rows={4}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>

              <div
                className="p-dialog-footer p-d-flex p-jc-center p-ai-center p-flex-column p-md-justify-between p-md-flex-row"
                style={{ textAlign: "center" }}
              >
                <Button
                  label="Cancelar"
                  severity="danger"
                  outlined
                  onClick={hideDialog}
                  className="p-button-secondary p-mb-2 p-md-mb-0"
                />
                <Button
                  label="Agregar Incidencia"
                  severity="danger"
                  disabled={!isIncidenciaValid}
                  onClick={agregarIncidencia}
                  className="p-button-success p-mb-2 p-md-mb-0"
                />
                <Button
                  label="Descargar"
                  severity="info"
                  className="p-button-secondary p-mb-2 p-md-mb-0"
                />
              </div>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SeguimientoVisita;
