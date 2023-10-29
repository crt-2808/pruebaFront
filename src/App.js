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

function App() {
  return (
    <UserProvider>
      <div className="App">
        <Routes>
          <Route index path="/" exact element={<Login />} />
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
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
