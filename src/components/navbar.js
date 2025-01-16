import React, { useState } from 'react';
import logo from '../img/logo final.png';
import ceth from '../img/Logo Ceth.jpg';
import latino from '../img/logo Latino.jpg';
import univic from '../img/logo univic (2).jpg';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../userProvider';
import { googleLogout } from '@react-oauth/google';
import Swal from 'sweetalert2';
import { FaUser, FaEdit, FaSignOutAlt } from 'react-icons/fa'; // Import icons

const Logo = ({ src, alt, className }) => (
  <img src={src} className={`align-top logo ${className}`} alt={alt} />
);

const UserProfile = ({ user, onLogout, onEditProfile }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const userDetails = () => {
    Swal.fire({
      title: `${user.name}`,
      html: `
        <div style="text-align: center;">
          <img src="${user.imageUrl}" class="usuario mb-3" alt="Imagen de perfil" style="width:80px; height:80px; border-radius: 50%;">
          <p>Email: ${user.email}</p>
        </div>`,
      showCloseButton: true,
      focusConfirm: false,
    });
  };

  return (
    <div className='user-profile'>
      {user ? (
        <img
          src={user.imageUrl}
          alt='Imagen de perfil'
          referrerPolicy='no-referrer'
          className='usuario'
          id='usuario'
          onClick={toggleMenu}
        />
      ) : (
        <div className='usuario'></div>
      )}
      <div className={`user-menu fade-inn ${menuVisible ? 'activo' : ''}`}>
        <div onClick={userDetails}>
          <FaUser className='icon' /> Mi perfil
        </div>
        <div onClick={onEditProfile}>
          <FaEdit className='icon' /> Editar perfil
        </div>
        <div onClick={onLogout}>
          <FaSignOutAlt className='icon' /> Cerrar sesión
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const { usuario, toggleUser } = useUserContext();
  const navigate = useNavigate();

  // const onLogoutSuccess = () => {
  //   sessionStorage.removeItem('jwtToken');
  //   toggleUser(null);
  //   navigate('/');
  // };

  // const { signOut } = useGoogleLogout({
  //   clientId,
  //   onLogoutSuccess,
  //   onFailure: () => console.log('logout fail'),
  // });

  const handleLogout = () => {
    // Eliminar información de sesión
    sessionStorage.removeItem('jwtToken');
    toggleUser(null);
    googleLogout(); // Llama a googleLogout para cerrar sesión en Google
    navigate('/');
  };

  const handleEditProfile = () => {
    navigate('/editarInfo');
  };

  return (
    <nav
      className='navbar nav__list navbar-light fluid justify-content-between'
      id='navbar'
    >
      <a className='navbar-brand' href={usuario ? '/land' : '/'}>
        <Logo src={logo} alt='' className='nav__item' />
        <Logo src={ceth} alt='' className='ceth nav__item' />
        <Logo src={latino} alt='' className='latino nav__item' />
        <Logo src={univic} alt='' className='univic nav__item' />
      </a>
      <div className='col-md-1'>
        <UserProfile
          user={usuario}
          onLogout={handleLogout}
          onEditProfile={handleEditProfile}
        />
      </div>
    </nav>
  );
};

export default Navbar;
