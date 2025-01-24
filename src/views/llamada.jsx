import Llamada from "../components/Llamada";
import Llamada_Colab from "../components/Colaborador/Llamada";
import NotFound from "../components/unAuthorized";
import RoleBasedView from "../components/common/RoleBasedView";

const LlamadaView = () => (
  <RoleBasedView 
    adminComponent={Llamada}
    userComponent={Llamada_Colab}
    unauthorizedComponent={NotFound}
  />
);

export default LlamadaView;