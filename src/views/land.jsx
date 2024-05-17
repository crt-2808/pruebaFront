import Land_Colab from "../components/Colaborador/land";
import Land from "../components/land";
import { getUserRole } from "../utils/auth";
import { useAuthRedirect } from '../useAuthRedirect';

function LandView() {
  useAuthRedirect();
  const USER_ROLE = getUserRole();
  console.log("USER_ROLE:", USER_ROLE);

  return (
    <div>
      {(() => {
        if (USER_ROLE === "lider" || USER_ROLE === "admin") {
          return <Land />;
        } else if (USER_ROLE === "colaborador") {
          return <Land_Colab />;
        }
        return <div>Ocurrio un error, contacta al equipo de soporte</div>;
      })()}
    </div>
  );
}

export default LandView;
