import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from './user-context';
import { checkAdminAccess, getAdminUser } from '@/lib/admin';
import type { AdminUser } from '@/types/admin';

type AdminContextType = {
  isAdmin: boolean;
  adminUser: AdminUser | null;
  loading: boolean;
  hasPermission: (permission: 'read' | 'write' | 'delete' | 'manage_users') => boolean;
};

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  adminUser: null,
  loading: true,
  hasPermission: () => false,
});

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        setAdminUser(null);
        setLoading(false);
        return;
      }

      try {
        const hasAccess = await checkAdminAccess(user.id);
        setIsAdmin(hasAccess);

        if (hasAccess) {
          const adminData = await getAdminUser(user.id);
          setAdminUser(adminData);
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        setIsAdmin(false);
        setAdminUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [user]);

  const hasPermission = (permission: 'read' | 'write' | 'delete' | 'manage_users'): boolean => {
    if (!isAdmin || !adminUser) return false;

    switch (permission) {
      case 'read':
        return ['admin', 'moderator', 'editor'].includes(adminUser.role);
      case 'write':
        return ['admin', 'moderator', 'editor'].includes(adminUser.role);
      case 'delete':
        return ['admin', 'moderator'].includes(adminUser.role);
      case 'manage_users':
        return adminUser.role === 'admin';
      default:
        return false;
    }
  };

  return (
    <AdminContext.Provider value={{ isAdmin, adminUser, loading, hasPermission }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
