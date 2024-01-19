export const getUserRole = () => {
  return sessionStorage.getItem("userRole");
};

export const isUserAdmin = () => {
  return getUserRole() === "admin";
};
