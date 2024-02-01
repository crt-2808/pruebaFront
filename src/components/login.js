import React from "react";
import { useEffect, useState } from "react";
import img_ejemplo from "../img/undraw_Blog_post_re_fy5x.png";
import Navbar from "./navbar";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../userProvider";
import { useAuthRedirect } from "../useAuthRedirect";
import { API_URL } from "../utils/api";
import { initGoogleAuth, clientId } from "../utils/googleAuth";
import { Toast } from "primereact/toast";

function Login() {
  useAuthRedirect();
  const navigate = useNavigate();
  const [tokenVencido, setTokenVencido] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const showTokenExpiredToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  useEffect(() => {
    initGoogleAuth();
    gapi.load("client:auth2", initGoogleAuth);
    const usuario = document.querySelector("#username");
    const dominios = ["uda.edu.mx"];
    const label = document.querySelector(".first");
    usuario.addEventListener("input", () => {
      const dominio = usuario.value.split("@");
      if (dominio[1] === dominios[0] || usuario.value === "") {
        label.classList.remove("dominio-incorrecto");
      } else {
        label.classList.add("dominio-incorrecto");
      }
    });
    // Verificar si el token está vencido aquí
    const isTokenExpired = () => {
      const jwtToken = sessionStorage.getItem("jwtToken");
      if (jwtToken) {
        const tokenData = JSON.parse(atob(jwtToken.split(".")[1]));
        const currentTimestamp = Math.floor(Date.now() / 1000);
        return tokenData.exp < currentTimestamp;
      }
      return true;
    };
    if (isTokenExpired()) {
      setTokenVencido(true);
      showTokenExpiredToast();
    }
  }, []);
  const { toggleUser, usuario } = useUserContext();

  const onSuccess = async (res) => {
    console.log(res.profileObj);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Correo: res.profileObj.email }),
      });

      if (!response.ok) {
        throw new Error("Error en la autenticación");
      }

      const { token, role } = await response.json(); // Obtener el JWT del backend y el rol del usuario
      sessionStorage.setItem("jwtToken", token); // Guardar el JWT en el almacenamiento de sesión
      sessionStorage.setItem("userRole", role); // Guardar el rol del usuario en el almacenamiento de sesión
      console.log("este es el role",role)
      toggleUser(res.profileObj);

      setTimeout(() => {
        const userRole=sessionStorage.getItem("userRole");
        if (userRole=="admin"||userRole=="lider"){
          navigate("/land");
        }else if (userRole=="colaborador"){
          navigate("/Colaborador/land")
        }
        
      }, 100);
    } catch (error) {
      console.error("Error en la autenticación:", error);
    }
  };

  const onFailure = (err) => {
    console.log("failed", err);
  };
  const logOut = () => {
    sessionStorage.removeItem("jwtToken");
    toggleUser(null);
    sessionStorage.removeItem("usuario");
  };
  useEffect(() => {
    if (usuario) {
      navigate("/land");
    }
  }, [usuario, navigate]);
  return (
    <div className="fluid">
      <Navbar></Navbar>
      <Toast
        position="top-right"
        baseZIndex={1000}
        visible={showToast.toString()}
        severity="warn"
      >
        Tu sesión ha expirado. Por favor, vuelve a entrar o actualiza la página.
      </Toast>

      <div className="container fluid">
        <div className="content">
          <div className="container">
            <div className="row land">
              <div className="col-md-6">
                <img
                  src={img_ejemplo}
                  alt="svg_ejemplo"
                  className="img-fluid"
                />
              </div>
              <div className="col-md-6 contents">
                <div className="row justify-content-center espacio">
                  <div className="col-md-8">
                    <div className="mb-4">
                      <h3>Ingresa tus credenciales</h3>
                    </div>
                    <form action="#" method="post">
                      <div className="form-group first">
                        {/* <label for="username">Usuario</label> */}
                        <input
                          type="text"
                          className="form-control"
                          id="username"
                          aria-label="Usuario"
                          placeholder="Usuario"
                          required
                        />
                      </div>
                      <div className="form-group last mb-4">
                        {/* <label for="password">Contraseña</label> */}
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          placeholder="Contraseña"
                          required
                        />
                      </div>

                      <div className="container fluid mb-5  align-items-center">
                        <div className="row justify-content-between">
                          <label className="control col-6 control--checkbox mb-0 justify-content-between">
                            <span className="caption">Recuérdame</span>
                            <input type="checkbox" />
                            <div className="control__indicator"></div>
                          </label>
                          <span className="ml-auto col-6">
                            <a href={"/"} className="forgot-pass">
                              Recuperar contraseña
                            </a>
                          </span>
                        </div>
                      </div>

                      <input
                        type="submit"
                        value="Ingresar"
                        className="btn btn-block btn-primary"
                      />

                      <span className="d-block text-left my-4 text-muted">
                        &mdash; Ó &mdash;
                      </span>

                      <div className="social-login">
                        {/* {profile ? (
                          <div>
                            <img
                              src={profile.imageUrl}
                              referrerPolicy="no-referrer"
                              alt="Foto usuario"
                            />
                            <h3>Usuario</h3>
                            <p>Nombre: {profile.name}</p>
                            <p>Email: {profile.email}</p>
                            <br />
                            <br />
                            <GoogleLogout
                              clientId={clientId}
                              buttonText="Log out"
                              onLogoutSuccess={logOut}
                            />
                          </div>
                        ) : (
                          <GoogleLogin
                            clientId={clientId}
                            buttonText="Sign in with Google"
                            onSuccess={onSuccess}
                            onFailure={onFailure}
                            cookiePolicy={"single_host_origin"}
                            isSignedIn={true}
                          />
                        )} */}
                        {usuario ? (
                          <div>Dentro</div>
                        ) : (
                          <GoogleLogin
                            clientId={clientId}
                            buttonText="Sign in with Google"
                            onSuccess={onSuccess}
                            onFailure={onFailure}
                            cookiePolicy={"single_host_origin"}
                            isSignedIn={true}
                          />
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// rafce

export default Login;
