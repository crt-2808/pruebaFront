export const SESSION_DURATION = 3600000; // 1 hour in milliseconds

export const SessionManager = {
  setSession: (token, role, userData) => {
    sessionStorage.setItem('jwtToken', token);
    sessionStorage.setItem('userRole', role);
    sessionStorage.setItem('sessionStart', Date.now().toString());
    sessionStorage.setItem('userData', JSON.stringify(userData));
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

  getToken: () => sessionStorage.getItem('jwtToken'),
  getRole: () => sessionStorage.getItem('userRole'),
  getUserData: () => JSON.parse(sessionStorage.getItem('userData'))
};