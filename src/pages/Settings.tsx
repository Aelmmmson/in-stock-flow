
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInventory } from '@/contexts/InventoryContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Settings = () => {
  const { currentUser } = useInventory();

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
            <Button variant="outline">Export Inventory Data (CSV)</Button>
            <Button variant="outline">Export Transaction History (CSV)</Button>
            <Button variant="outline">Backup All Data</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <h3 className="font-medium">In-Stock Flow</h3>
            <p className="text-sm text-muted-foreground">Version 1.0.0</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
