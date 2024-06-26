import  {  createContext, useContext, useState } from 'react'

const userContext = createContext()

export function useUserContext(){
    return useContext(userContext)
}


const UserProvider = ({children}) => {

  //    const[usuario,setUsuario]= useState(null)
  const [usuario, setusuario] = useState(() => {
    // Intentar recuperar la información del usuario de sessionStorage
    const savedUser = sessionStorage.getItem('usuario');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [jwtToken, setJwtToken] = useState(() => {
    // Recuperar el JWT de sessionStorage
    return sessionStorage.getItem('jwtToken');
  });
  const [isBlocked, setIsBlocked] = useState(false);
  const toggleUser = (us) => {
    console.log(us);
    setusuario(us);
    if (us) {
        // Si el usuario está establecido, guardarlo en sessionStorage
        sessionStorage.setItem('usuario', JSON.stringify(us));
    } else {
      sessionStorage.clear();
      setJwtToken(null);
      setIsBlocked(false);

    }
  }
  const toggleUserBlocked = (blocked) => {
    setIsBlocked(blocked);
};
  
    return (
      <userContext.Provider value={{usuario,toggleUser, isBlocked, toggleUserBlocked}}>
           {children}
      </userContext.Provider>
    )
  }

export default UserProvider