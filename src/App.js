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
          <Route path="/Colaborador/land" element={<Land_Colab />}/>
          <Route path="/Colaborador/planeador" element={<Planeador_Colab />}/>
          <Route path="/Colaborador/Cambaceo" element={<Cambaceo_Colab/>}/>
          <Route path="/Colaborador/Cambaceo_Diario" element={<Cambaceo_Diario_Colab/>}/>
          <Route path="/Colaborador/Cambaceo_Semanal" element={<Cambaceo_Semanal_Colab/>}/>
          <Route path="/Colaborador/Visita_Programada" element={<Visita_Colab/>}/>
          <Route path="/Colaborador/PruebaMaps" element={<Colab_PruebaMaps/>}/>
          <Route path="/Colaborador/Llamada" element={<Llamada_Colab/>}/>
          <Route path="/Colaborador/Incidencia" element={<AgregarIncidencia/>}/>
          <Route path="*" element={<Land />} />
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
