export const getUserRole = () => {
  return sessionStorage.getItem("userRole");
};

export const isUserAdmin = () => {
  return getUserRole() === "admin";
};

export const isUserLider = () => {
  return getUserRole() === "lider";
};

export const isAuthenticated = () => {
  const token = sessionStorage.getItem("jwtToken");
  return token !== null && token !== undefined;
  
};
