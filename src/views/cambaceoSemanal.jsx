import CambaceoSemanal from "../components/CambaceoSemanal";
import Cambaceo_Semanal_Colab from "../components/Colaborador/Cambaceo_Semanal";
import { getUserRole } from "../utils/auth";

function CambaceoSemanalView() {
  const USER_ROLE = getUserRole();
  return (
    <div>
      {(() => {
        if (USER_ROLE === "lider" || USER_ROLE === "admin" || USER_ROLE === "gerente") {
          return <CambaceoSemanal />;
        } else if (USER_ROLE === "colaborador"||USER_ROLE=="coordinador") {
          return <Cambaceo_Semanal_Colab />;
        }
        return <div>Ocurrio un error, contacta al equipo de soporte</div>;
      })()}
    </div>
  );
}

export default CambaceoSemanalView;