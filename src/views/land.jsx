import Land_Colab from "../components/Colaborador/land";
import Land from "../components/land";
import NotFound from "../components/unAuthorized";
import RoleBasedView from "../components/common/RoleBasedView";

const LandView = () => (
  <RoleBasedView 
    adminComponent={Land}
    userComponent={Land_Colab}
    unauthorizedComponent={NotFound}
  />
);

export default LandView;
