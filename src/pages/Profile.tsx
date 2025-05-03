
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Camera } from 'lucide-react';

const Profile = () => {
  const { toast } = useToast();
  
  // In a real app, this would come from an auth context
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : { 
      name: 'Admin User',
      email: 'admin@didiz.com',
      role: 'admin',
      avatar: '/lovable-uploads/453620d9-01b8-4040-aec4-9f948e52aae1.png'
    };
  });
  
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = () => {
    // Update the user in localStorage
    const updatedUser = { ...user, name, email };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully",
    });
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill all password fields",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation do not match",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would call an API to change the password
    
    toast({
      title: "Password changed",
      description: "Your password has been updated successfully",
    });
    
    // Clear password fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-md">
              <img
                src={user.avatar || '/placeholder.svg'}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full shadow-md hover:bg-pink-600">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
          <p className="text-sm text-gray-500 capitalize">{user.role}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Personal Information</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <Button
              onClick={handleSaveProfile}
              className="bg-pink-500 hover:bg-pink-600 mt-2"
            >
              Save Changes
            </Button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Change Password</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <Button
              onClick={handleChangePassword}
              className="bg-pink-500 hover:bg-pink-600 mt-2"
            >
              Update Password
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
