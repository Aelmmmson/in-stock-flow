
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Camera, User, Mail, Phone, MapPin, Pencil, Save, X, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || ''
  });
  const [avatar, setAvatar] = useState<string | null>(currentUser?.avatar || null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  useEffect(() => {
    // Reset form data when user changes
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || ''
      });
      setAvatar(currentUser.avatar || null);
    }
  }, [currentUser]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingAvatar(true);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
          setUploadingAvatar(false);
        }
      };
      reader.onerror = () => {
        toast.error("Failed to read file");
        setUploadingAvatar(false);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async () => {
    try {
      if (!currentUser) {
        toast.error("No user data available");
        return;
      }
      
      // Show temporary success indicator
      setSaveSuccess(true);
      
      // Create updated user object with all required properties
      const updatedUser = {
        ...currentUser,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        avatar: avatar
      };
      
      // Save user data
      await updateUserProfile(updatedUser);
      
      setIsEditing(false);
      
      toast.success("Profile updated successfully");
      
      // Hide success indicator after a delay
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
      setSaveSuccess(false);
    }
  };
  
  const toggleEdit = () => {
    if (isEditing) {
      // Cancel edit
      if (currentUser) {
        setFormData({
          name: currentUser.name || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
          address: currentUser.address || ''
        });
        setAvatar(currentUser.avatar || null);
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
          <div className="relative">
            <div 
              className="w-32 h-32 rounded-full bg-gray-700 overflow-hidden"
              onClick={() => isEditing && fileInputRef.current?.click()}
            >
              {avatar ? (
                <img 
                  src={avatar} 
                  alt={currentUser?.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer">
                  {uploadingAvatar ? (
                    <div className="animate-pulse">Uploading...</div>
                  ) : (
                    <Camera className="h-8 w-8 text-white" />
                  )}
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={!isEditing || uploadingAvatar}
            />
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">{currentUser?.name || 'User'}</h2>
              <Button 
                variant={isEditing ? "destructive" : "outline"} 
                size="sm"
                onClick={toggleEdit}
                className="flex gap-1 items-center"
                disabled={uploadingAvatar}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4" /> Cancel
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4" /> Edit Profile
                  </>
                )}
              </Button>
            </div>
            
            <div className="text-sm text-pink-400 font-medium mb-4">
              {currentUser?.role === 'admin' ? 'Administrator' : 
               currentUser?.role === 'manager' ? 'Manager' : 'Cashier'}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <span>{currentUser?.email || 'user@example.com'}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                <span>{currentUser?.phone || 'Not specified'}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                <span>{currentUser?.address || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isEditing && (
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-medium text-white mb-4">Edit Profile</h3>
          
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address" className="text-gray-300">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <Button 
            onClick={handleSubmit} 
            className="w-full mt-4 bg-pink-500 hover:bg-pink-600 relative"
            disabled={uploadingAvatar || saveSuccess}
          >
            {saveSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Saved Successfully
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      )}
      
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Account Settings</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-700">
            <div>
              <h4 className="font-medium text-white">Change Password</h4>
              <p className="text-xs text-gray-400">Update your account password</p>
            </div>
            <Button variant="outline" size="sm">
              Change
            </Button>
          </div>
          
          <div className="flex justify-between items-center pb-3 border-b border-gray-700">
            <div>
              <h4 className="font-medium text-white">Two-Factor Authentication</h4>
              <p className="text-xs text-gray-400">Add an extra layer of security</p>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-white text-red-500">Delete Account</h4>
              <p className="text-xs text-gray-400">Permanently delete your account</p>
            </div>
            <Button variant="outline" size="sm" className="text-red-500 border-red-500 hover:bg-red-500/10">
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
