
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInventory } from '@/contexts/InventoryContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Monitor } from 'lucide-react';
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

      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>
            Manage your account settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <p className="text-sm font-medium mt-1">{currentUser.name}</p>
            </div>
            <div>
              <Label>Role</Label>
              <p className="text-sm font-medium mt-1 capitalize">{currentUser.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>
            Customize the look and feel of the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              className="flex flex-col items-center gap-2 h-auto py-4"
              onClick={() => setTheme('light')}
            >
              <Sun className="h-6 w-6" />
              <span>Light</span>
            </Button>
            
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              className="flex flex-col items-center gap-2 h-auto py-4"
              onClick={() => setTheme('dark')}
            >
              <Moon className="h-6 w-6" />
              <span>Dark</span>
            </Button>
            
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              className="flex flex-col items-center gap-2 h-auto py-4"
              onClick={() => setTheme('system')}
            >
              <Monitor className="h-6 w-6" />
              <span>System</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>
            Control how the application works
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Receive Low Stock Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when products reach their minimum threshold
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Backup Data</Label>
              <p className="text-sm text-muted-foreground">
                Automatically backup inventory data daily
              </p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Price History in Reports</Label>
              <p className="text-sm text-muted-foreground">
                Include price change history in generated reports
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Manage your application data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Button variant="outline" onClick={() => handleExport('Inventory Data')}>Export Inventory Data (CSV)</Button>
            <Button variant="outline" onClick={() => handleExport('Transaction History')}>Export Transaction History (CSV)</Button>
            <Button variant="outline" onClick={() => handleExport('Financial Reports')}>Export Financial Reports (CSV)</Button>
            <Button variant="outline" onClick={() => handleExport('All Data')}>Backup All Data</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <h3 className="font-medium">Didiz Closet</h3>
            <p className="text-sm text-muted-foreground">Version 1.0.0</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
