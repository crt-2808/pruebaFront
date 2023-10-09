import React, { Component } from "react";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import Navbar from "./navbar";
import { ArrowLeft } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

class SeguimientoLlamada2 extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      selectedValue: "",
      inputValue: "",
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:3005/SeguimientoLlamada") // Reemplaza '/datos' con la ruta correcta a tu servidor
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((error) => {
        console.error("Error al obtener datos: " + error.message);
      });
  }

  handleChange = (e) => {
    this.setState({ selectedValue: e.value });

    if (e.value !== "") {
      this.setState({ inputValue: "" });
    }
  };
  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };
  handleUpdate = () => {
    const { selectedValue, inputValue } = this.state;

    if (selectedValue !== "" && inputValue !== "") {
      axios
        .put("http://localhost:3005/agregarIncidencia3", {
          telefono: selectedValue,
          nuevaIncidencia: inputValue,
        })
        .then((response) => {
          console.log(response.data); // Maneja la respuesta del servidor si es necesario
          Swal.fire({
            icon: 'success',
            title: 'Incidencia registrada correctamente.',
            text: 'UDA',
            timer: 1200,
            timerProgressBar: true,
            backdrop: `
                rgba(36,32,32,0.65)
              `,        
          }).then(() => {
            // Recarga la página después de mostrar la alerta de éxito.
            window.location.reload();
          });
        })
        .catch((error) => {
          console.error("Error al actualizar: " + error.message);
        });
    }else{
        return Swal.fire({
            icon: "error",
            title: "No ha registrado ninguna Incidencia",
            text: "UDA",
            timer: 1200,
            timerProgressBar: true,
            backdrop: `
                rgba(36,32,32,0.65)
              `,
          });
    }

  };

  handleExport = () => {
    axios
      .get("http://localhost:3005/exportarLlamada") // Reemplaza '/exportar' con la ruta correcta a tu servidor
      .then((response) => {
        const csvData = response.data;
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "planificador.csv";
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error al exportar: " + error.message);
      });
  };
  render() {
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
          value={this.state.selectedValue}
          options={this.state.data}
          optionLabel="NombreCompleto"
          filter
          showClear
          filterBy="NombreCompleto"
          placeholder="Selecciona un contacto a llamar"
          onChange={this.handleChange}
        />
                {this.state.selectedValue !== '' && (
          <div>
            <InputTextarea
              rows={5}
              autoResize
              placeholder="Ingresa Incidencia aquí"
              value={this.state.inputValue}
              onChange={this.handleInputChange}
              style={{ width: '100%', marginTop: '15px' }}
            />
            <Button
              label="Actualizar"
              icon="pi pi-check" // Icono de check
              onClick={this.handleUpdate}
              style={{ marginTop: '10px' }}
            />
          </div>
        )}
        <Button
          className="p-button-info" // Estilo de info
          label="Exportar"
          rounded
          size="large"
          onClick={this.handleExport}
          style={{ marginTop: '50px', maxWidth: "100%", width: "auto" }}

        />

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default SeguimientoLlamada2;
