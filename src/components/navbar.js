import React, { useEffect } from "react";
import logo from "../img/logo final.png";
import ceth from "../img/Logo Ceth.jpg";
import latino from "../img/logo Latino.jpg";
import univic from "../img/logo univic (2).jpg";
import { BiUserCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../userProvider";
import { useGoogleLogout } from "react-google-login";

const clientId =
  "422356463744-6ph6gvs0ge55fqli9nkv09lhfpu0amjv.apps.googleusercontent.com";

const Navbar = () => {
  const { toggleUser } = useUserContext();
  const navigate = useNavigate();
  const onLogoutSuccess = () => {
    console.log("logout");
    navigate("/");
  };
  const onFailure = () => {
    console.log("logout fail");
  };
  const { signOut } = useGoogleLogout({
    clientId,
    onLogoutSuccess: onLogoutSuccess,
    onFailure: onFailure,
  });
  useEffect(() => {
    const usuarioIcon = document.querySelector(".usuario");
    var cont = 0;
    usuarioIcon.addEventListener("click", () => {
      const menu = document.querySelector(".user-menu");
      // menu.classList.toggle("activo");
      if (cont == 0) {
        menu.classList.add("activo");
        cont++;
      } else {
        menu.classList.remove("activo");
        cont = 0;
      }
    });
    const cerrar = document.querySelector("#logout");
    cerrar.addEventListener("click", () => {
      toggleUser(null);
      signOut();
    });
  }, []);
  const { usuario } = useUserContext();
  return (
    <nav
      className="navbar nav__list navbar-light fluid  justify-content-between"
      id="navbar"
    >
      <a className="navbar-brand" href={usuario ? "/land" : "/"}>
        <img src={logo} className=" align-top logo nav__item" alt="" />
        <img src={ceth} className=" align-top logo ceth nav__item" alt="" />
        <img src={latino} className=" align-top logo latino nav__item" alt="" />
        <img src={univic} className=" align-top logo univic nav__item" alt="" />
      </a>
      <div className="col-md-1">
        {/* <BiUserCircle className="usuario" /> */}
        {usuario ? (
          <img
            src={usuario.imageUrl}
            alt="Imagen de perfil"
            referrerPolicy="no-referrer"
            className="usuario"
            id="usuario"
          ></img>
        ) : (
          <div className="usuario"></div>
        )}
      </div>
      <div className="user-menu">
        <div>Mi perfil</div>
        <div id="logout">Cerrar sesión</div>
      </div>
    </nav>
  );
};

export default Navbar;
