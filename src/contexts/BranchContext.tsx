import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Branch, Staff, BusinessInfo } from '../types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

// Sample data
const sampleBranches: Branch[] = [
  {
    id: '1',
    name: 'Main Store - Accra',
    address: 'Oxford Street, Osu, Accra',
    phone: '+233 50 123 4567',
    email: 'accra@didizcloset.com',
    manager: 'user-2',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Kumasi Branch',
    address: 'Adum, Kumasi',
    phone: '+233 50 987 6543',
    email: 'kumasi@didizcloset.com',
    manager: 'user-3',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const sampleStaff: Staff[] = [
  {
    id: 'staff-1',
    name: 'Mary Asante',
    email: 'mary@didizcloset.com',
    role: 'cashier',
    branchId: '1',
    phone: '+233 50 111 2222',
    hireDate: '2024-01-15',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'staff-2',
    name: 'John Mensah',
    email: 'john@didizcloset.com',
    role: 'salesperson',
    branchId: '2',
    phone: '+233 50 333 4444',
    hireDate: '2024-02-01',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const sampleBusinessInfo: BusinessInfo = {
  id: '1',
  name: "Didiz Closet",
  description: "Premium Fashion Boutique",
  address: "Oxford Street, Osu, Accra, Ghana",
  phone: "+233 50 123 4567",
  email: "info@didizcloset.com",
  website: "www.didizcloset.com",
  taxId: "TAX123456789",
  registrationNumber: "REG987654321",
  updatedAt: new Date().toISOString(),
};

interface BranchContextType {
  branches: Branch[];
  staff: Staff[];
  businessInfo: BusinessInfo;
  currentBranch: Branch | null;
  addBranch: (branch: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBranch: (branch: Branch) => void;
  deleteBranch: (id: string) => void;
  addStaff: (staff: Omit<Staff, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateStaff: (staff: Staff) => void;
  deleteStaff: (id: string) => void;
  updateBusinessInfo: (info: BusinessInfo) => void;
  switchBranch: (branchId: string) => void;
  getUserBranch: () => Branch | null;
  canSwitchBranches: () => boolean;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
};

interface BranchProviderProps {
  children: ReactNode;
}

export const BranchProvider = ({ children }: BranchProviderProps) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(sampleBusinessInfo);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Load data from localStorage or use sample data
    const storedBranches = localStorage.getItem('didiz-closet-branches');
    const storedStaff = localStorage.getItem('didiz-closet-staff');
    const storedBusinessInfo = localStorage.getItem('didiz-closet-business-info');
    const storedCurrentBranch = localStorage.getItem('didiz-closet-current-branch');
    
    const loadedBranches = storedBranches ? JSON.parse(storedBranches) : sampleBranches;
    setBranches(loadedBranches);
    setStaff(storedStaff ? JSON.parse(storedStaff) : sampleStaff);
    setBusinessInfo(storedBusinessInfo ? JSON.parse(storedBusinessInfo) : sampleBusinessInfo);
    
    // Set current branch based on user role
    if (currentUser?.role === 'owner') {
      const savedBranch = storedCurrentBranch ? JSON.parse(storedCurrentBranch) : loadedBranches[0];
      setCurrentBranch(savedBranch);
    } else {
      // For non-owners, set branch based on their assignment
      const userStaff = sampleStaff.find(s => s.email === currentUser?.email);
      if (userStaff) {
        const userBranch = loadedBranches.find(b => b.id === userStaff.branchId);
        setCurrentBranch(userBranch || null);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('didiz-closet-branches', JSON.stringify(branches));
    localStorage.setItem('didiz-closet-staff', JSON.stringify(staff));
    localStorage.setItem('didiz-closet-business-info', JSON.stringify(businessInfo));
    if (currentBranch) {
      localStorage.setItem('didiz-closet-current-branch', JSON.stringify(currentBranch));
    }
  }, [branches, staff, businessInfo, currentBranch]);

  const canSwitchBranches = () => {
    return currentUser?.role === 'owner';
  };

  const getUserBranch = () => {
    if (currentUser?.role === 'owner') {
      return currentBranch;
    }
    
    // Find staff member's branch
    const userStaff = staff.find(s => s.email === currentUser?.email);
    if (userStaff) {
      return branches.find(b => b.id === userStaff.branchId) || null;
    }
    
    return null;
  };

  const addBranch = (branch: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBranch: Branch = {
      ...branch,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBranches([...branches, newBranch]);
    toast({
      title: "Branch Added",
      description: `${newBranch.name} has been added successfully`,
    });
  };

  const updateBranch = (updatedBranch: Branch) => {
    setBranches(branches.map(branch => 
      branch.id === updatedBranch.id 
        ? { ...updatedBranch, updatedAt: new Date().toISOString() }
        : branch
    ));
    toast({
      title: "Branch Updated",
      description: `${updatedBranch.name} has been updated`,
    });
  };

  const deleteBranch = (id: string) => {
    const branchToDelete = branches.find(b => b.id === id);
    if (branchToDelete) {
      setBranches(branches.filter(branch => branch.id !== id));
      toast({
        title: "Branch Deleted",
        description: `${branchToDelete.name} has been removed`,
        variant: "destructive",
      });
    }
  };

  const addStaff = (staffMember: Omit<Staff, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newStaff: Staff = {
      ...staffMember,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setStaff([...staff, newStaff]);
    toast({
      title: "Staff Added",
      description: `${newStaff.name} has been added to the team`,
    });
  };

  const updateStaff = (updatedStaff: Staff) => {
    setStaff(staff.map(member => 
      member.id === updatedStaff.id 
        ? { ...updatedStaff, updatedAt: new Date().toISOString() }
        : member
    ));
    toast({
      title: "Staff Updated",
      description: `${updatedStaff.name} has been updated`,
    });
  };

  const deleteStaff = (id: string) => {
    const staffToDelete = staff.find(s => s.id === id);
    if (staffToDelete) {
      setStaff(staff.filter(member => member.id !== id));
      toast({
        title: "Staff Removed",
        description: `${staffToDelete.name} has been removed from the team`,
        variant: "destructive",
      });
    }
  };

  const updateBusinessInfo = (info: BusinessInfo) => {
    setBusinessInfo({ ...info, updatedAt: new Date().toISOString() });
    toast({
      title: "Business Info Updated",
      description: "Business information has been updated successfully",
    });
  };

  const switchBranch = (branchId: string) => {
    if (!canSwitchBranches()) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to switch branches",
        variant: "destructive",
      });
      return;
    }
    
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      setCurrentBranch(branch);
      toast({
        title: "Branch Switched",
        description: `Now viewing ${branch.name}`,
      });
    }
  };

  return (
    <BranchContext.Provider value={{
      branches,
      staff,
      businessInfo,
      currentBranch,
      addBranch,
      updateBranch,
      deleteBranch,
      addStaff,
      updateStaff,
      deleteStaff,
      updateBusinessInfo,
      switchBranch,
      getUserBranch,
      canSwitchBranches,
    }}>
      {children}
    </BranchContext.Provider>
  );
};
