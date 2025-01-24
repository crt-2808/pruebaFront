import Cambaceo from "../components/Cambaceo";
import Cambaceo_Colab from "../components/Colaborador/Cambaceo";
import NotFound from "../components/unAuthorized";
import RoleBasedView from "../components/common/RoleBasedView";

const CambaceoView = () => (
  <RoleBasedView 
    adminComponent={Cambaceo}
    userComponent={Cambaceo_Colab}
    unauthorizedComponent={NotFound}
  />
);

export default CambaceoView;
