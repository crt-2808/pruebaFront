export const getUserRole = () => {
  return sessionStorage.getItem("userRole");
};

export const isUserAdmin = () => {
  return getUserRole() === "admin";
};

export const isAuthenticated = () => {
  const token = sessionStorage.getItem("jwtToken");
  return token !== null && token !== undefined;
  
};
export const hasPermission = (requiredPermission) => {
  const userRole = getUserRole();
  return userRole === requiredPermission;
};