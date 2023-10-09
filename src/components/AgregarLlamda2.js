import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import axios from "axios";
import Swal from "sweetalert2";
/*
function AgregarLlamda() {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fecha, setFecha] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [documentos, setDocumentos] = useState([]);

  const handleSubmit = () => {
    // Aquí puedes enviar los datos a la base de datos MySQL utilizando Axios u otra biblioteca de HTTP.
    // Por ejemplo, puedes enviarlos a una API REST.

    const data = {
      nombreCompleto,
      telefono,
      fecha,
      descripcion,
      documentos,
    };

    // Enviar 'data' a tu servidor MySQL aquí

    // Luego, puedes realizar una redirección o mostrar un mensaje de éxito.
  };

  return (
    <div>
      <h1>Formulario de Registro</h1>
      <div className="p-field">
        <label htmlFor="nombreCompleto">Nombre Completo</label>
        <InputText id="nombreCompleto" value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} />
      </div>
      <div className="p-field">
        <label htmlFor="telefono">Teléfono</label>
        <InputText id="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
      </div>
      <div className="p-field">
        <label htmlFor="fecha">Fecha</label>
        <Calendar id="fecha" value={fecha} onChange={(e) => setFecha(e.value)} showIcon />
      </div>
      <div className="p-field">
        <label htmlFor="descripcion">Descripción</label>
        <InputTextarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={5} />
      </div>
      <div className="p-field">
        <label>Documentos</label>
        <FileUpload
          name="documentos"
          url="https://your-server.com/upload"
          mode="advanced"
          accept="image/*,application/pdf"
          onSelect={(e) => setDocumentos(e.files)}
          multiple
        />
      </div>
      <Button label="Confirmar" onClick={handleSubmit} severity="success" />
    </div>
  );
}

export default AgregarLlamda;
*/

function AgregarLlamda() {
  const [NombreCompleto, setNombreCompleto] = useState("");
  const [Telefono, setTelefono] = useState("");
  const [FechaAsignacion, setFecha] = useState(null);
  const [Descripcion, setDescripcion] = useState("");
  const [DocumentosReal, setDocumentos] = useState([]);

  const handleSubmit = () => {
    // Aquí puedes enviar los datos a la base de datos MySQL utilizando Axios u otra biblioteca de HTTP.
    // Por ejemplo, puedes enviarlos a una API REST.

    const data = {
      NombreCompleto,
      Telefono,
      FechaAsignacion,
      Descripcion,
    };
    axios
      .post("http://localhost:3005/guardar_datos", data)
      .then((response) => {
        // Muestra una alerta de éxito
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Los datos se han registrado correctamente',
        });
      })
      .catch((error) => {
        // Muestra una alerta de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al registrar los datos',
        });
        console.error('Error al enviar los datos al servidor:', error);
      });
  };

  return (
    <div>
      <h1>Formulario de Registro</h1>
      <div className="p-field">
        <label htmlFor="NombreCompleto">
          Nombre Completo
          <br />
        </label>
      </div>
      <div>
        <InputText
          id="NombreCompleto"
          value={NombreCompleto}
          onChange={(e) => setNombreCompleto(e.target.value)}
        />
      </div>
      <div className="p-field">
        <label htmlFor="Telefono">Teléfono</label>
      </div>
      <div>
        <InputText
          id="Telefono"
          value={Telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
      </div>
      <div className="p-field">
        <label htmlFor="FechaAsignacion">Fecha y Hora</label>
      </div>
      <div>
        <Calendar
          id="FechaAsignacion"
          value={FechaAsignacion}
          onChange={(e) => setFecha(e.value)}
          showIcon
          showTime
          hourFormat="12"
          dateFormat="mm/dd/yy"
        />
      </div>
      <div className="p-field">
        <label htmlFor="Descripcion">Descripción</label>
      </div>
      <div>
        <InputTextarea
          id="Descripcion"
          autoResize 
          value={Descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={5}
        />
      </div>
      <div className="p-field">
        <label>Documentos</label>
        <FileUpload
          name="DocumentosReal"
          url="https://your-server.com/upload"
          mode="advanced"
          accept="image/*,application/pdf"
          onSelect={(e) => setDocumentos(e.files)}
          multiple
          auto
          disabled
        />
      </div>
      <Button label="Confirmar" onClick={handleSubmit} severity="success" />
    </div>
  );
}

export default AgregarLlamda;
