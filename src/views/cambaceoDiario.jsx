import CambaceoDiario from "../components/CambaceoDiario";
import Cambaceo_Diario_Colab from "../components/Colaborador/Cambaceo_Diario";
import { getUserRole } from "../utils/auth";

function CambaceoDiarioView() {
  const USER_ROLE = getUserRole();
  return (
    <div>
      {(() => {
        if (USER_ROLE === "lider" || USER_ROLE === "admin" || USER_ROLE === "gerente") {
          return <CambaceoDiario />;
        } else if (USER_ROLE === "colaborador"||USER_ROLE=="coordinador") {
          return <Cambaceo_Diario_Colab />;
        }
        return <div>Ocurrio un error, contacta al equipo de soporte</div>;
      })()}
    </div>
  );
}

export default CambaceoDiarioView;