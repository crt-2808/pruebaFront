import { getUserRole } from "../utils/auth";
import Cambaceo from "../components/Cambaceo";
import Cambaceo_Colab from "../components/Colaborador/Cambaceo";
function CambaceoView() {
  const USER_ROLE = getUserRole();
  return (
    <div>
      {(() => {
        if (USER_ROLE === "lider" || USER_ROLE === "admin") {
          return <Cambaceo />;
        } else if (USER_ROLE === "colaborador") {
          return <Cambaceo_Colab />;
        }
        return <div>Ocurrio un error, contacta al equipo de soporte</div>;
      })()}
    </div>
  );
}

export default CambaceoView;
