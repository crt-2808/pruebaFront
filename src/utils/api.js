export const API_URL = process.env.REACT_APP_API_URL;

export const fetchColaboradores = () => {
  return fetch(`${API_URL}/colaborador`).then((response) => response.json());
};
export async function fetchWithToken(url, options) {
  const jwtToken = sessionStorage.getItem('jwtToken');

  if (!jwtToken) {
    // Si no hay un token en sessionStorage, desautentica al usuario y redirige al inicio de sesión
    sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem('usuario');
    window.location.href = '/login';
    return null;
  }
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${sessionStorage.getItem('jwtToken')}`,
    },
  });

  if (!response.ok) {
    // Si la respuesta no es 200-299, maneja los diferentes casos
    if (response.status === 401) {
      // Token ha expirado o no es válido
      sessionStorage.removeItem('jwtToken');
      sessionStorage.removeItem('usuario');
      window.location.href = '/login';
    } else if (response.status === 500) {
      throw new Error('Error del servidor (500)');
    } else {
      throw new Error('Error en la respuesta del servidor');
    }
  }

  return response;
}
