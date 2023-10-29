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
  const toggleUser = (us) => {
    console.log(us);
    setusuario(us);
    if (us) {
        // Si el usuario está establecido, guardarlo en sessionStorage
        sessionStorage.setItem('usuario', JSON.stringify(us));
    } else {
        // Si el usuario no está establecido (es decir, null), eliminarlo de sessionStorage
        sessionStorage.removeItem('usuario');
    }
  }
  
    return (
      <userContext.Provider value={{usuario,toggleUser}}>
           {children}
      </userContext.Provider>
    )
  }

export default UserProvider