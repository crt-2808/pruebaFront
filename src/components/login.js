import React from "react";
import { useEffect } from "react";
import img_ejemplo from "../img/undraw_Blog_post_re_fy5x.png";
import Navbar from "./navbar";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { gapi } from "gapi-script";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../userProvider";
const clientId =
  "422356463744-6ph6gvs0ge55fqli9nkv09lhfpu0amjv.apps.googleusercontent.com";

function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    const initClient = () => {
      gapi.auth2.init({
        clientId: clientId,
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);
    const usuario = document.querySelector("#username");
    const dominios = ["uda.edu.mx"];
    const label = document.querySelector(".first");
    usuario.addEventListener("input", () => {
      const dominio = usuario.value.split("@");
      if (dominio[1] == dominios[0] || usuario.value == "") {
        label.classList.remove("dominio-incorrecto");
      } else {
        label.classList.add("dominio-incorrecto");
      }
    });
  });
  const { toggleUser, usuario } = useUserContext();

  const onSuccess = (res) => {
    console.log(res.profileObj);
    // setProfile(res.profileObj);
    toggleUser(res.profileObj);
    console.log(res.profileObj);
    setTimeout(() => {
      navigate("/land");
    }, 100);
  };

  const onFailure = (err) => {
    console.log("failed", err);
  };
  const logOut = () => {
    // setProfile(null);
    toggleUser(null);
  };
  return (
    <div className="fluid">
      <Navbar></Navbar>
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
