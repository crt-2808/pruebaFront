import CambaceoDiario from "../components/CambaceoDiario";
import Cambaceo_Diario_Colab from "../components/Colaborador/Cambaceo_Diario";
import NotFound from "../components/unAuthorized";
import RoleBasedView from "../components/common/RoleBasedView";

const CambaceoDiarioView = () => (
  <RoleBasedView 
    adminComponent={CambaceoDiario}
    userComponent={Cambaceo_Diario_Colab}
    unauthorizedComponent={NotFound}
  />
);

export default CambaceoDiarioView;