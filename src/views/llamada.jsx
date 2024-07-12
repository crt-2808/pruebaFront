import { getUserRole } from "../utils/auth";
import Llamada from "../components/Llamada";
import Llamada_Colab from "../components/Colaborador/Llamada";
function LlamadaView() {
  const USER_ROLE = getUserRole();
  return (
    <div>
      {(() => {
        if (USER_ROLE === "lider" || USER_ROLE === "admin" || USER_ROLE === "gerente") {
          return <Llamada />;
        } else if (USER_ROLE === "colaborador"||USER_ROLE=="coordinador") {
          return <Llamada_Colab />;
        }
        return <div>Ocurrio un error, contacta al equipo de soporte</div>;
      })()}
    </div>
  );
}

export default LlamadaView;