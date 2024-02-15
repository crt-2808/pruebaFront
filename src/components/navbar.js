import React, { useState, useContext, useEffect } from 'react';
import logo from '../img/logo final.png';
import ceth from '../img/Logo Ceth.jpg';
import latino from '../img/logo Latino.jpg';
import univic from '../img/logo univic (2).jpg';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../userProvider';
import { useGoogleLogout } from 'react-google-login';
import { clientId } from '../utils/googleAuth';
import Swal from 'sweetalert2';

const Logo = ({ src, alt, className }) => (
  <img src={src} className={`align-top logo ${className}`} alt={alt} />
);

const UserProfile = ({ user, onLogout }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const userDetails = () => {
    Swal.fire({
      title: `${user.name}`,
      html:
        `<img src="${user.imageUrl}" class="usuario mb-3" alt="Imagen de perfil" style="width:80px; height:80px;border-radius: 50%;">` +
        `<p>Email: ${user.email}</p>`,
      showCloseButton: true,
      focusConfirm: false,
    });
  };

  return (
    <div>
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
      <div className={`user-menu ${menuVisible ? 'activo' : ''}`}>
        <div onClick={userDetails}>Mi perfil</div>
        <div onClick={onLogout}>Cerrar sesión</div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const { usuario, toggleUser } = useUserContext();
  const navigate = useNavigate();
  const onLogoutSuccess = () => {
    sessionStorage.removeItem('jwtToken');
    toggleUser(null);
    navigate('/');
  };

  const { signOut } = useGoogleLogout({
    clientId,
    onLogoutSuccess,
    onFailure: () => console.log('logout fail'),
  });

  const handleLogout = () => {
    sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem('userRole');
    toggleUser(null);
    signOut();
    navigate('/');
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
        <UserProfile user={usuario} onLogout={handleLogout} />
      </div>
    </nav>
  );
};

export default Navbar;
