
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useBranch } from '@/contexts/BranchContext';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, ChevronDown } from 'lucide-react';

const BranchSelector = () => {
  const { branches, currentBranch, switchBranch, canSwitchBranches } = useBranch();
  const { currentUser } = useAuth();

  if (!currentUser || !canSwitchBranches()) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Building2 className="h-4 w-4 text-gray-500" />
      <Select value={currentBranch?.id || ''} onValueChange={switchBranch}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select branch">
            {currentBranch ? (
              <div className="flex items-center">
                <span className="truncate">{currentBranch.name}</span>
              </div>
            ) : (
              'Select branch'
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {branches.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
              <div className="flex items-center justify-between w-full">
                <span>{branch.name}</span>
                {branch.id === currentBranch?.id && (
                  <Badge variant="secondary" className="ml-2">Current</Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BranchSelector;
