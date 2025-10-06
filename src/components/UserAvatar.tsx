import { User, LogOut, Settings, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { useAdmin } from '@/contexts/admin-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserAvatar = () => {
  const { user, logout } = useStore();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleAdminAccess = () => {
    navigate('/admin');
  };

  // Get user's name or email for display
  const displayName = user?.user_metadata?.full_name || user?.email || 'User';
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="nav-button bg-black/30 border border-purple-500/30 hover:border-purple-500/50 hover:bg-black/40"
        >
          <User className="w-4 h-4 mr-2" />
          {displayName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {isAdmin && (
          <>
            <DropdownMenuItem onClick={handleAdminAccess}>
              <Shield className="w-4 h-4 mr-2" />
              Admin Panel
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem>
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
