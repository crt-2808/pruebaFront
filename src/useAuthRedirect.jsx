import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./userProvider";

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { usuario } = useUserContext();

  useEffect(() => {
    if (!usuario) {
      navigate("/");
    }
  }, [usuario, navigate]);
};
