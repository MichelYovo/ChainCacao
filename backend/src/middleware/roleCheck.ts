export interface User {
  id: string;
  email: string;
  role: string;
}

export type AllowedRole = 'Agriculteur' | 'Coopérative' | 'Transporteur' | 'Transformateur' | 'Exportateur' | 'Acheteur' | 'Ministère' | 'Admin';

export function roleCheck(...allowedRoles: AllowedRole[]) {
  return (req: any, res: any, next: any) => {
    const user = req.user as User;
    
    if (!user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    if (!allowedRoles.includes(user.role as AllowedRole)) {
      return res.status(403).json({ 
        message: `Accès refusé. Rôle requis: ${allowedRoles.join(', ')}. Votre rôle: ${user.role}` 
      });
    }

    next();
  };
}

export function requireRole(role: AllowedRole | AllowedRole[]) {
  const roles = Array.isArray(role) ? role : [role];
  return roleCheck(...roles);
}
