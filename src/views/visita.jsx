import Visita_Colab from "../components/Colaborador/Visita";
import VisitaProgramada from "../components/VisitaProgramada";
import NotFound from "../components/unAuthorized";
import RoleBasedView from "../components/common/RoleBasedView";

const VisitaView = () => (
  <RoleBasedView 
    adminComponent={VisitaProgramada}
    userComponent={Visita_Colab}
    unauthorizedComponent={NotFound}
  />
);

export default VisitaView;