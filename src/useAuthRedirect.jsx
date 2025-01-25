import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserContext } from "./userProvider";
import { SessionManager } from "./utils/sessionManager";

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, toggleUser } = useUserContext();

  useEffect(() => {
    const checkAuth = () => {
      const isValidSession = SessionManager.isSessionValid();
      const currentPath = location.pathname;
      const isLoginPage = currentPath === '/';

      if (!isValidSession) {
        // Clear invalid session
        SessionManager.clearSession();
        toggleUser(null);
        
        if (!isLoginPage) {
          navigate('/', { replace: true });
        }
        return;
      }

      if (isLoginPage && isValidSession) {
        navigate('/land');
      }
    };

    checkAuth();

    // Set up session refresh interval
    const refreshInterval = setInterval(() => {
      if (SessionManager.isSessionValid()) {
        SessionManager.refreshSession();
      }
    }, 300000); // Refresh every 5 minutes

    return () => clearInterval(refreshInterval);
  }, [navigate, location, toggleUser]);
};
