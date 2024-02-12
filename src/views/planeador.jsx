import { getUserRole } from "../utils/auth";
import Planeador from "../components/planeador";
import Planeador_Colab from "../components/Colaborador/planeador";

function PlaneadorView() {
  const USER_ROLE = getUserRole();
  return (
    <div>
      {(() => {
        if (USER_ROLE === "lider" || USER_ROLE === "admin") {
          return <Planeador />;
        } else if (USER_ROLE === "colaborador") {
          return <Planeador_Colab />;
        }
        return <div>Ocurrio un error, contacta al equipo de soporte</div>;
      })()}
    </div>
  );
}

export default PlaneadorView;
