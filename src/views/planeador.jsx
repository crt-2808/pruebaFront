import Planeador from "../components/planeador";
import Planeador_Colab from "../components/Colaborador/planeador";
import NotFound from "../components/unAuthorized";
import RoleBasedView from "../components/common/RoleBasedView";

const PlaneadorView = () => (
  <RoleBasedView 
    adminComponent={Planeador}
    userComponent={Planeador_Colab}
    unauthorizedComponent={NotFound}
  />
);

export default PlaneadorView;
