import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

class MyComponent extends React.Component {
  handleButtonClick = () => {
    const data = {
      id: 48,
      fecha: '2027-07-19 00:31:44',
    };

    axios.get('http://localhost:3005/exportarCambaceoDiario', { params: data })
      .then((response) => {
        if (response.data.empty) {
          // Mostrar una alerta Swal en el frontend si el CSV está vacío
          Swal.fire({
            icon: 'info',
            title: 'Archivo CSV vacío',
            text: 'No hay datos para esa fecha.',

          });
        } else {
          // Manejar la respuesta del servidor, por ejemplo, descargar el archivo CSV
          const blob = new Blob([response.data], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'cambaceo_diario.csv';
          a.click();
          window.URL.revokeObjectURL(url);
        }
      })
      .catch((error) => {
        // Manejar errores, como la solicitud al servidor
        console.error('Error al exportar datos:', error);
      });
  };

  handleButtonClick1 = () => {
    const data = {
      id: 53,
      fecha: '2024-05-01 20:30:00',
    };

    axios.get('http://localhost:3005/exportarCambaceoSemanal', { params: data })
      .then((response) => {
        if (response.data.empty) {
          // Mostrar una alerta Swal en el frontend si el CSV está vacío
          Swal.fire({
            icon: 'info',
            title: 'Archivo CSV vacío',
            text: 'No hay datos para ese rango de fechas.',

          });
        } else {
          // Manejar la respuesta del servidor, por ejemplo, descargar el archivo CSV
          const blob = new Blob([response.data], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'cambaceo_semanal.csv';
          a.click();
          window.URL.revokeObjectURL(url);
        }
      })
      .catch((error) => {
        // Manejar errores, como la solicitud al servidor
        console.error('Error al exportar datos:', error);
      });
  };

  render() {
    return (
      <div>
        <button onClick={this.handleButtonClick}>Exportar Datos</button>
        <button onClick={this.handleButtonClick1}>Exportar Datos semanal</button>
      </div>
    );
  }
}

export default MyComponent;





