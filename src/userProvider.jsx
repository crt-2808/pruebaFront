import  {  createContext, useContext, useState } from 'react'

const userContext = createContext()

export function useUserContext(){
    return useContext(userContext)
}


const UserProvider = ({children}) => {

//    const[usuario,setUsuario]= useState(null)
   const [usuario, setusuario] = useState(null)
   const toggleUser = (us)=>{
    console.log(us);
        setusuario(us)
   }

  return (
    <userContext.Provider value={{usuario,toggleUser}}>
         {children}
    </userContext.Provider>
  )
}

export default UserProvider