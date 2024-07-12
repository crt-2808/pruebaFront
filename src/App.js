import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import Login from './components/login';
import UserProvider from './userProvider';
import AgregarColab from './components/agregarColab';
import EditarColab from './components/editarColab';
import CalendarioVisita from './components/CalendarioVisita';
import PruebaMaps from './components/pruebaMaps';
import SeguimientoCambaceo from './components/seguimientoCambaceo';
import CalendarioLlamada from './components/CalendarioLlamada';
import SeguimientoColab from './components/seguimientoColab';
import SeguimientoDiarioColab from './components/seguimientoDiarioColab';
import SeguimientoLlamada from './components/SeguimientoLlamada';
import SeguimientoVisita from './components/SeguimientoVisita';
import Colab_PruebaMaps from './components/Colaborador/pruebaMaps';
import AgregarIncidencia from './components/Colaborador/Incidencia';
import PruebaMapsLeaflet from './components/Prueba/pruebaMapsLeaflet';
import NotFound from './components/unAuthorized';
import ProtectedRoutes from './utils/ProtectedRoute';
import CrearLider from './components/CrearLider';
import Blocked from './components/Blocked';

import SeguimientoCambaceos from './components/SeguimientoCambaceos';
//Prueba views
import LandView from './views/land';
import PlaneadorView from './views/planeador';
import CambaceoView from './views/cambaceo';
import VisitaView from './views/visita';
import LlamadaView from './views/llamada';
import CambaceoDiarioView from './views/cambaceoDiario';
import CambaceoSemanalView from './views/cambaceoSemanal';
import AllUsuers from './components/AllUsuers';
import Equipos from './components/Equipos';
import CrearEquipo from './components/CrearEquipo';
import EditarEquipo from './components/EditarEquipo';
import EditarInfo from './components/editarInfo';
function App() {
  return (
    <UserProvider>
      <div className='App'>
        <Routes>
          {/* Rutas publicas */}
          <Route index path='/' exact element={<Login />} />
          <Route path='*' element={<LandView />} />
          <Route path='/prueba/mapa' element={<PruebaMapsLeaflet />} />
          <Route path='/unAuthorized' element={<NotFound />} />
          <Route path='/prueba' element={<PruebaMaps />} />
          <Route path='/blocked' element={<Blocked />} />
          <Route path='/editarInfo' element={<EditarInfo />} />

          {/*Rutas de vistas */}
          <Route
            element={
              <ProtectedRoutes
                allowedRoles={['lider', 'admin', 'colaborador', 'coordinador', 'gerente']}
                exact
              />
            }
          >
            <Route path='/land' element={<LandView />} />
            <Route path='/planeador' element={<PlaneadorView />} />
            <Route path='/cambaceo' element={<CambaceoView />} />
            <Route path='/visitaProgramada' element={<VisitaView />} />
            <Route path='/llamada' element={<LlamadaView />} />
            <Route path='/cambaceoDiario' element={<CambaceoDiarioView />} />
            <Route path='/cambaceoSemanal' element={<CambaceoSemanalView />} />
          </Route>

          {/*Ruta de lider o admin */}
          <Route
            element={
              <ProtectedRoutes allowedRoles={['lider', 'admin', 'gerente','coordinador']} exact />
            }
          >
            <Route path='/Equipos' element={<Equipos />} />
            <Route path='/agregarColab' element={<AgregarColab />} />
            <Route path='/editarColab' element={<EditarColab />} />
            <Route path='/crearEquipo' element={<CrearEquipo/>} />
            <Route path='/EditarEquipo/:id' element={<EditarEquipo/>}/>
            <Route
              path='/SeguimientoCambaceo'
              element={<SeguimientoCambaceo />}
            />
            <Route
              path='/SeguimientoCambaceo/Semanal/:id'
              element={<SeguimientoColab />}
            />
            <Route
              path='/SeguimientoCambaceo/Diario/:id'
              element={<SeguimientoDiarioColab />}
            />
            <Route path='/CalendarioVisita' element={<CalendarioVisita />} />
            <Route path='/CalendarioLlamada' element={<CalendarioLlamada />} />
            <Route path='/SeguimientoVisita' element={<SeguimientoVisita />} />
            <Route path='/SeguimientoCambaceos' element={<SeguimientoCambaceos />} />
            <Route
              path='/SeguimientoLlamada'
              element={<SeguimientoLlamada />}
            />
    
          </Route>

          {/*Ruta de los colaboradores */}
          <Route
            element={<ProtectedRoutes allowedRoles={['colaborador', 'coordinador']} exact />}
          >
            <Route
              element={<Colab_PruebaMaps />}
              path='/Colaborador/PruebaMaps'
            />
            <Route
              element={<AgregarIncidencia />}
              path='/Colaborador/Incidencia'
            />
          </Route>

          {/* Ruta de admin */}
          <Route element={<ProtectedRoutes allowedRoles={['admin']} exact />}>
            <Route path='/crearLider' element={<CrearLider />} />
            <Route path='/usuarios' element={<AllUsuers />} />
          </Route>
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
