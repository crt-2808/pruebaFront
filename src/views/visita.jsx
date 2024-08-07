import { getUserRole } from "../utils/auth";
import Visita_Colab from "../components/Colaborador/Visita";
import VisitaProgramada from "../components/VisitaProgramada";
function VisitaView() {
  const USER_ROLE = getUserRole();
  return (
    <div>
      {(() => {
        if (USER_ROLE === "lider" || USER_ROLE === "admin" || USER_ROLE === "gerente") {
          return <VisitaProgramada />;
        } else if (USER_ROLE === "colaborador"||USER_ROLE=="coordinador") {
          return <Visita_Colab />;
        }
        return <div>Ocurrio un error, contacta al equipo de soporte</div>;
      })()}
    </div>
  );
}

export default VisitaView;