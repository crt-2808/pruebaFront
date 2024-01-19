import { gapi } from "gapi-script";
export const clientId =
  "422356463744-6ph6gvs0ge55fqli9nkv09lhfpu0amjv.apps.googleusercontent.com";

export const initGoogleAuth = () => {
  return new Promise((resolve) => {
    if (window.gapi) {
      window.gapi.load("client:auth2", () => {
        window.gapi.auth2
          .init({
            client_id: clientId,
            scope: "",
          })
          .then(resolve);
      });
    } else {
      // Si gapi no está disponible, espera a que se cargue antes de inicializar
      window.addEventListener("gapiLoaded", () => {
        window.gapi.load("client:auth2", () => {
          window.gapi.auth2
            .init({
              client_id: clientId,
              scope: "",
            })
            .then(resolve);
        });
      });
    }
  });
};
