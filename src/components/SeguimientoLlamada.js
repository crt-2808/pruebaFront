//SeguimientoLlamada getLlamadas
import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import { ArrowLeft } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import Swal from 'sweetalert2';


function SeguimientoLlamada() {
 const [data, setData] = useState([]);
 const [selectedItem, setSelectedItem] = useState(null);
 const [incidencia, setIncidencia] = useState("");
 const [isIncidenciaValid, setIsIncidenciaValid] = useState(false);
 const [visible, setVisible] = useState(false);
 const [incidencias, setIncidencias] = useState([""]); // Array para almacenar múltiples incidencias
 const [numIncidencias, setNumIncidencias] = useState(0);


 const agregarNuevoCampoIncidencia = () => {
   if (numIncidencias < 3) {
     setIncidencias([...incidencias, ""]);
     setNumIncidencias(numIncidencias + 1);
   } else {
     // Muestra el popup indicando que no se pueden agregar más incidencias
     mostrarPopupLimiteIncidencias();
   }
 };


 const mostrarPopupLimiteIncidencias = () => {
   // Puedes usar una librería de popups como Swal o cualquier otra de tu elección
   // Aquí hay un ejemplo con la librería Swal
   Swal.fire({
     icon: "warning",
     title: "Límite de incidencias alcanzado",
     text: "No se pueden agregar más incidencias.",
     timer: 1500,
   });
 };


 useEffect(() => {
   fetchData();
 });


 const fetchData = () => {
   axios
     .get("http://localhost:3005/getLlamadas")
     .then((response) => setData(response.data))
     .catch((error) => console.error("Error fetching data:", error));
 };


 const showDialog = (item) => {
   setSelectedItem(item);
   setVisible(true);
 };


 const hideDialog = () => {
   setSelectedItem(null);
   setIncidencia("");
   setVisible(false);
 };


 const agregarIncidencia = () => {
   axios
     .put(`http://localhost:3005/api/planificador/${selectedItem.ID}`, {
       incidencia,
     })
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
         title={item.NombreCompleto}
         subTitle={item.FechaAsignacion}
         footer={cardFooter(item)}
         style={{ width: "300px", margin: "10px" }}
       >
         <div>{item.Telefono}</div>
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
         <Link to="/Llamada">
           <ArrowLeft className="ml-4 regreso" />
           <span style={{ marginBottom: "100px" }} id="indicador">
             Menu Llamda
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
         <h2 className="titulo-cambaceo px-5 ">Seguimiento Llamada</h2>
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
             header={`Llamada - ${
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


                   <label>Telefono:</label>
                   <br />
                   <input
                     type="text"
                     value={selectedItem ? selectedItem.Telefono : ""}
                     disabled
                   />
                   <br />
                   <label>Fecha Asignacion:</label>
                   <br />
                   <input
                     type="text"
                     value={selectedItem ? selectedItem.FechaAsignacion : ""}
                     disabled
                   />


                 </div>
                 <div className="col-md-8 mt-2">
                   <label>Descripcion:</label>
                   <textarea
                     value={selectedItem ? selectedItem.Descripcion : ""}
                     disabled
                     rows={2}
                     style={{ width: "100%" }}
                   />
                   <div>
                     {incidencias.map((valor, index) => (
                       <div key={index}>
                         <label htmlFor={`incidencia-${index}`}>
                           Incidencia {index + 1}:
                         </label>
                         <input
                           id={`incidencia-${index}`}
                           type="text"
                           value={valor}
                           onChange={(e) => {
                             const nuevasIncidencias = [...incidencias];
                             nuevasIncidencias[index] = e.target.value;
                             setIncidencias(nuevasIncidencias);
                           }}
                         />
                         {index < 3 && (
                           <button onClick={agregarNuevoCampoIncidencia}>
                             +
                           </button>
                         )}
                       </div>
                     ))}
                   </div>
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
export default SeguimientoLlamada;






