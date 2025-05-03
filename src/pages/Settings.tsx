
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useInventory } from '@/contexts/InventoryContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Monitor, LogOut, User, Bell, AlertCircle, Printer, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const { currentUser } = useInventory();
  const { theme, setTheme } = useTheme();

  const handleExport = (dataType: string) => {
    toast(`${dataType} export feature coming soon`, {
      description: "This functionality will be added in a future update"
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

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

      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <h3 className="font-medium mb-4">Account</h3>
          
          <div className="space-y-3">
            <Link to="/profile" className="flex items-center space-x-3 py-2">
              <User className="h-5 w-5 text-gray-500" />
              <span>Profile</span>
            </Link>
            
            <Link to="#" className="flex items-center space-x-3 py-2">
              <HelpCircle className="h-5 w-5 text-gray-500" />
              <span>Help & Support</span>
            </Link>
            
            <Link to="/login" className="flex items-center space-x-3 py-2 text-red-500">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Link>
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
