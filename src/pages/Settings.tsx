
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useInventory } from '@/contexts/InventoryContext';
import { useTheme } from '@/components/ui/theme-provider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Monitor, LogOut, User, Bell, AlertCircle, Printer, HelpCircle, Building2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Settings = () => {
  const { currentUser } = useInventory();
  const { theme, setTheme } = useTheme();
  const { logout, hasAdminAccess } = useAuth();
  const navigate = useNavigate();

  const handleExport = (dataType: string) => {
    toast(`${dataType} export feature coming soon`, {
      description: "This functionality will be added in a future update"
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast("Logged out successfully");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Owner/Admin Management Section */}
      {hasAdminAccess() && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">Management</h3>
            
            <div className="space-y-3">
              <Link to="/branch-management" className="flex items-center space-x-3 py-2">
                <Building2 className="h-5 w-5 text-gray-500" />
                <span>Branch Management</span>
              </Link>
              
              <Link to="/branch-management" className="flex items-center space-x-3 py-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span>Staff Management</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications Settings */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-500" />
              <div>
                <Label>Enable Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive alerts and updates</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-gray-500" />
              <div>
                <Label>Low Stock Alerts</Label>
                <p className="text-xs text-muted-foreground">Get notified when items are running low</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Printer Settings */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <Printer className="h-5 w-5 text-gray-500" />
              <div>
                <Label>Printer Settings</Label>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Connect Printer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <Sun className="h-5 w-5 text-gray-500" />
              <div>
                <Label>Theme</Label>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-3">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center justify-center"
              onClick={() => setTheme('light')}
            >
              Light
            </Button>
            
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center justify-center"
              onClick={() => setTheme('dark')}
            >
              Dark
            </Button>
            
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center justify-center"
              onClick={() => setTheme('system')}
            >
              System
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <h3 className="font-medium mb-4">Account</h3>
          
          <div className="space-y-3">
            <Link to="/settings/profile" className="flex items-center space-x-3 py-2">
              <User className="h-5 w-5 text-gray-500" />
              <span>Profile</span>
            </Link>
            
            <Link to="/help" className="flex items-center space-x-3 py-2">
              <HelpCircle className="h-5 w-5 text-gray-500" />
              <span>Help & Support</span>
            </Link>
            
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 py-2 text-red-500 w-full text-left"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center py-4">
        <div className="text-center space-y-2">
          <h3 className="font-medium">Didiz Closet</h3>
          <p className="text-xs text-muted-foreground">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
