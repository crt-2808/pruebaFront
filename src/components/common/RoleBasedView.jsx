import { getUserRole } from "../../utils/auth";

const ADMIN_ROLES = ["lider", "admin", "gerente"];
const USER_ROLES = ["colaborador", "coordinador"];

const RoleBasedView = ({ 
  adminComponent: AdminComponent, 
  userComponent: UserComponent,
  unauthorizedComponent: UnauthorizedComponent 
}) => {
  const USER_ROLE = getUserRole();
  
  if (ADMIN_ROLES.includes(USER_ROLE)) {
    return <AdminComponent />;
  } 
  
  if (USER_ROLES.includes(USER_ROLE)) {
    return <UserComponent />;
  }
  
  if (UnauthorizedComponent) {
    return <UnauthorizedComponent />;
  }
  
  return <div>Ocurrio un error, contacta al equipo de soporte</div>;
};

export default RoleBasedView;