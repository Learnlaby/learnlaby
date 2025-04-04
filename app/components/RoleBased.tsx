interface RoleBasedProps {
    allowedRoles: string[]
    userRole: string
    children: React.ReactNode
  }
  
  const RoleBased = ({ allowedRoles, userRole, children }: RoleBasedProps) => {
    if (allowedRoles.includes(userRole)) {
      return <>{children}</>
    }
    return null
  }
  
  export default RoleBased
  