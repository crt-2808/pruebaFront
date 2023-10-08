/*
import React, { Component } from "react";
import axios from "axios";

class Dropdown extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      selectedValue: "",
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:3005/agregaIncidencia") // Reemplaza '/datos' con la ruta correcta a tu servidor
      .then((response) => {
        console.log(response.data); // Agrega esta línea para verificar los datos en la consola
        this.setState({ data: response.data });
      })
      .catch((error) => {
        console.error("Error al obtener datos: " + error.message);
      });
  }

  handleChange = (event) => {
    this.setState({ selectedValue: event.target.value });
  };

  render() {
    return (
      <div>
        <select value={this.state.selectedValue} onChange={this.handleChange}>
          <option value="">Selecciona un valor</option>
          {this.state.data.map((item) => (
            <option key={item.id} value={item.id}>
              {item.NombreCompleto} - {item.Telefono}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default Dropdown;

//Esto si funciona
import React, { Component } from "react";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";

class DropdownLlamada extends Component {
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
      .get("http://localhost:3005/SeguimientoLlamada")
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((error) => {
        console.error("Error al obtener datos: " + error.message);
      });
  }

  handleChange = (event) => {
    this.setState({ selectedValue: event.target.value });
    if (event.target.value !== "") {
      this.setState({ inputValue: "" });
    }
  };

  handleInputChange = (event) => {
    this.setState({ inputValue: event.target.value });
  };

  handleUpdate = () => {
    const selectedValue = this.state.selectedValue;
    const inputValue = this.state.inputValue;

    axios
      .put("http://localhost:3005/agregaIncidencia", {
        telefono: selectedValue,
        nuevaIncidencia: inputValue,
      }) // Cambia 'nuevoTelefono' a 'nuevaIncidencia'
      .then((response) => {
        console.log("Actualización exitosa");
        // Puedes agregar aquí lógica adicional después de la actualización
      })
      .catch((error) => {
        console.error("Error al actualizar: " + error.message);
      });
  };

  handleExport = () => {
    // Realiza una solicitud al servidor para generar y descargar el archivo CSV
    axios
      .get("http://localhost:3005/exportarLlamada") // Cambia '/exportar' con la ruta correcta a tu servidor
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

  /*
  render() {
    return (
      <div>
        <select value={this.state.selectedValue} onChange={this.handleChange}>
          <option value="">Selecciona un valor</option>
          {this.state.data.map((item) => (
            <option key={item.id} value={item.Telefono}>
              {item.NombreCompleto} - {item.Telefono}
            </option>
          ))}
        </select>

        {this.state.selectedValue !== '' && (
          <div>
            <input
              type="text"
              placeholder="Ingresa Incidencia aquí"
              value={this.state.inputValue}
              onChange={this.handleInputChange}
            />
            <button onClick={this.handleUpdate}>Actualizar</button>
          </div>
        )}

        <button onClick={this.handleExport}>Exportar</button>
      </div>
    );
    
   //Aqui esta el cambio a primereact
  render() {
    return (
      <div>
        <Dropdown
          value={this.state.selectedValue}
          options={this.state.data}
          optionLabel="NombreCompleto"
          filter
          showClear
          filterBy="NombreCompleto"
          placeholder="Selecciona un valor"
          onChange={this.handleChange}
        />

        {this.state.selectedValue !== "" && (
          <div>
            <InputTextarea
              rows={5}
              autoResize
              placeholder="Ingresa Incidencia aquí"
              value={this.state.inputValue}
              onChange={this.handleInputChange}
            />
            <Button
              label="Actualizar"
              icon="pi pi-check" // Icono de check
              onClick={this.handleUpdate}
            />
          </div>
        )}

        <Button
          label="Exportar"
          className="p-button-info" // Estilo de info
          onClick={this.handleExport}
        />
      </div>
    );
  }
}

export default DropdownLlamada;
*/


import React, { Component } from 'react';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

class DropdownComponent extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      selectedValue: '',
      inputValue: '',
    };
  }

  componentDidMount() {
    axios.get('http://localhost:3005/SeguimientoLlamada') // Reemplaza '/datos' con la ruta correcta a tu servidor
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((error) => {
        console.error('Error al obtener datos: ' + error.message);
      });
  }

  handleChange = (e) => {
    this.setState({ selectedValue: e.value });

    if (e.value !== '') {
      this.setState({ inputValue: '' });
    }
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleUpdate = () => {
    const { selectedValue, inputValue } = this.state;

    if (selectedValue !== '' && inputValue !== '') {
      axios.put('http://localhost:3005/agregarIncidencia2', { telefono: selectedValue, nuevaIncidencia: inputValue })
        .then((response) => {
          console.log(response.data); // Maneja la respuesta del servidor si es necesario
        })
        .catch((error) => {
          console.error('Error al actualizar: ' + error.message);
        });
    }
  };

  handleExport = () => {
    axios.get('http://localhost:3005/exportarLlamada') // Reemplaza '/exportar' con la ruta correcta a tu servidor
      .then((response) => {
        const csvData = response.data;
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'planificador.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Error al exportar: ' + error.message);
      });
  };

  render() {
    return (
      <div>
        <Dropdown
          value={this.state.selectedValue}
          options={this.state.data}
          optionLabel="NombreCompleto"
          filter
          showClear
          filterBy="NombreCompleto"
          placeholder="Selecciona un valor"
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
            />
            <Button
              label="Actualizar"
              icon="pi pi-check" // Icono de check
              onClick={this.handleUpdate}
            />
          </div>
        )}

        <Button
          label="Exportar"
          className="p-button-info" // Estilo de info
          onClick={this.handleExport}
        />
      </div>
    );
  }
}

export default DropdownComponent;
