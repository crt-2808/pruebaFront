export const API_URL = "https://sarym-production-4033.up.railway.app/api/v2";

export const fetchColaboradores = () => {
  return fetch(`${API_URL}/colaborador`).then((response) => response.json());
};
export async function fetchWithToken(url, options) {
  const jwtToken = sessionStorage.getItem("jwtToken");

  if (!jwtToken) {
    // Si no hay un token en sessionStorage, desautentica al usuario y redirige al inicio de sesión
    sessionStorage.removeItem("jwtToken");
    sessionStorage.removeItem("usuario");
    window.location.href = "/login";
    return null;
  }
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
    },
  });

  if (response.status === 401) {
    // Token ha expirado o no es válido
    sessionStorage.removeItem("jwtToken"); // Remueve el token expirado
    sessionStorage.removeItem("usuario");
    window.location.href = "/login";
  }

  return response;
}
