export const SESSION_DURATION = 3600000; // 1 hour in milliseconds

export const SessionManager = {
  setSession: (token, role, userData, vistoTour) => {
    sessionStorage.setItem('vistoTour', vistoTour);
    sessionStorage.setItem('jwtToken', token);
    sessionStorage.setItem('userRole', role);
    sessionStorage.setItem('sessionStart', Date.now().toString());
    sessionStorage.setItem('userData', JSON.stringify(userData));
    sessionStorage.setItem('vistasTour', JSON.stringify([]));
  },

  clearSession: () => {
    sessionStorage.clear();
  },

  isSessionValid: () => {
    const token = sessionStorage.getItem('jwtToken');
    const sessionStart = parseInt(sessionStorage.getItem('sessionStart'));

    if (!token || !sessionStart) return false;

    const currentTime = Date.now();
    return currentTime - sessionStart < SESSION_DURATION;
  },

  refreshSession: () => {
    const sessionStart = parseInt(sessionStorage.getItem('sessionStart'));
    if (sessionStart) {
      sessionStorage.setItem('sessionStart', Date.now().toString());
    }
  },

  setVistoTour: (vistoTour) => {
    sessionStorage.setItem('vistoTour', vistoTour);
  },

  getToken: () => sessionStorage.getItem('jwtToken'),
  getRole: () => sessionStorage.getItem('userRole'),
  getUserData: () => JSON.parse(sessionStorage.getItem('userData')),
  getVistoTour: () => sessionStorage.getItem('vistoTour'),

  // ✅ Nueva funcionalidad para manejar el estado de los tours
  getVistasTour: () => JSON.parse(sessionStorage.getItem('vistasTour')) || [],
  addVistaTour: (vista) => {
    let vistas = JSON.parse(sessionStorage.getItem('vistasTour')) || [];
    if (!vistas.includes(vista)) {
      vistas.push(vista);
      sessionStorage.setItem('vistasTour', JSON.stringify(vistas));
    }
  },
};
