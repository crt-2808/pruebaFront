import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Land from "./components/land";
import UserProvider from "./userProvider";
import AgregarColab from "./components/agregarColab";
import EditarColab from "./components/editarColab";
import Planeador from "./components/planeador";
import Visita from "./components/visita";
import CambaceoDiario from "./components/CambaceoDiario";
import CambaceoSemanal from "./components/CambaceoSemanal";
import CalendarioVisita from "./components/CalendarioVisita";
import MenuCambaceo from "./components/Cambaceo";
import VisitaProgramada from "./components/VisitaProgramada";
import PruebaMaps from "./components/pruebaMaps";
import SeguimientoCambaceo from "./components/seguimientoCambaceo";
import Llamada from "./components/Llamada";
import CalendarioLlamada from "./components/CalendarioLlamada";
import SeguimientoColab from "./components/seguimientoColab";
import SeguimientoDiarioColab from "./components/seguimientoDiarioColab";
import AgregarVisita from "./components/AgregarVisita";
import Mamado from "./components/mamado";
import SeguimientoLlamada from "./components/SeguimientoLlamada";
import SeguimientoVisita from "./components/SeguimientoVisita";
import SeleccionColaboradores from "./components/ConfirmacionCambaceo1";
import Land_Colab from "./components/Colaborador/land";
import Planeador_Colab from "./components/Colaborador/planeador";
import Cambaceo_Colab from "./components/Colaborador/Cambaceo";
import Cambaceo_Diario_Colab from "./components/Colaborador/Cambaceo_Diario";
import Cambaceo_Semanal_Colab from "./components/Colaborador/Cambaceo_Semanal";
import Visita_Colab from "./components/Colaborador/Visita";
import Colab_PruebaMaps from "./components/Colaborador/pruebaMaps";
import Llamada_Colab from "./components/Colaborador/Llamada";
import AgregarIncidencia from "./components/Colaborador/Incidencia";
import PruebaMapsLeaflet from "./components/Prueba/pruebaMapsLeaflet";

import { Navigate } from "react-router-dom";
//Middleware
import { isAuthenticated, hasPermission } from "./utils/auth";




const ProtectedRoute=({children})=>{
  const {userAuth}=isAuthenticated();
  if(!isAuthenticated){
    return <Navigate to="/login" />
  }
  return children
}

function App() {
  return (
    <UserProvider>
      <div className="App">
        <Routes>
          
          <Route index path="/" exact element={<Login />} /> 
          {/*Ruta de lider o admin */}
          <Route path="/land" element={<Land />} />
          <Route path="/agregarColab" element={<AgregarColab />} />
          <Route path="/editarColab" element={<EditarColab />} />
          <Route path="/planeador" element={<Planeador />} />
          <Route path="/visita" element={<Visita />} />
          <Route path="/CambaceoDiario" element={<CambaceoDiario />} />
          <Route path="/CambaceoSemanal" element={<CambaceoSemanal />} />
          <Route
            path="/SeguimientoCambaceo"
            element={<SeguimientoCambaceo />}
          />
          <Route path="/CalendarioVisita" element={<CalendarioVisita />} />
          <Route path="/CalendarioLlamada" element={<CalendarioLlamada />} />
          <Route path="/Cambaceo" element={<MenuCambaceo />} />
          <Route path="/VisitaProgramada" element={<VisitaProgramada />} />
          <Route path="/Llamada" element={<Llamada />} />
          <Route path="/prueba" element={<PruebaMaps />} />
          <Route
            path="/SeguimientoCambaceo/Semanal/:id"
            element={<SeguimientoColab />}
          />
          <Route
            path="/SeguimientoCambaceo/Diario/:id"
            element={<SeguimientoDiarioColab />}
          />
          <Route path="/AgregarVisita" element={<AgregarVisita />} />
          <Route path="/VisitaAgregar" element={<Mamado />} />
          <Route path="/SeguimientoVisita" element={<SeguimientoVisita />} />
          <Route
            path="/SeleccionColaboradores"
            element={<SeleccionColaboradores />}
          />
          <Route path="/SeguimientoLlamada" element={<SeguimientoLlamada />} />


          {/*Ruta de los colaboradores */}
          <Route path="/Colaborador/land" element={<ProtectedRoute><Land_Colab /></ProtectedRoute>} />
          <Route path="/Colaborador/planeador" element={<ProtectedRoute><Planeador_Colab /></ProtectedRoute>} />
          <Route path="/Colaborador/Cambaceo" element={<ProtectedRoute><Cambaceo_Colab /></ProtectedRoute>} />
          <Route
            path="/Colaborador/Cambaceo_Diario"
            element={<ProtectedRoute><Cambaceo_Diario_Colab /></ProtectedRoute>}
          />
          <Route
            path="/Colaborador/Cambaceo_Semanal"
            element={<ProtectedRoute><Cambaceo_Semanal_Colab /></ProtectedRoute>}
          />
          <Route
            path="/Colaborador/Visita_Programada"
            element={<ProtectedRoute><Visita_Colab /></ProtectedRoute>}
          />
          <Route
            path="/Colaborador/PruebaMaps"
            element={<ProtectedRoute><Colab_PruebaMaps /></ProtectedRoute>}
          />
          <Route path="/Colaborador/Llamada" element={<ProtectedRoute><Llamada_Colab /></ProtectedRoute>} />
          <Route
            path="/Colaborador/Incidencia"
            element={<ProtectedRoute><AgregarIncidencia /></ProtectedRoute>}
          />

          <Route path="*" element={<Land />} />
          <Route path="/prueba/mapa" element={<PruebaMapsLeaflet />} />


          {/*Lo que intente*/}
          {/*  
          <PrivateRoute path="/land" requiredRole="admin">
            <Land />
          </PrivateRoute>
          <PrivateRoute path="/agregarColab" requiredRole="admin">
            <AgregarColab />
          </PrivateRoute>
          */}

        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
