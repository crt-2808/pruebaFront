import CambaceoSemanal from "../components/CambaceoSemanal";
import Cambaceo_Semanal_Colab from "../components/Colaborador/Cambaceo_Semanal";
import NotFound from "../components/unAuthorized";
import RoleBasedView from "../components/common/RoleBasedView";

const CambaceoSemanalView = () => (
  <RoleBasedView 
    adminComponent={CambaceoSemanal}
    userComponent={Cambaceo_Semanal_Colab}
    unauthorizedComponent={NotFound}
  />
);

export default CambaceoSemanalView;