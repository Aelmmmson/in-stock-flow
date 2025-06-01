
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBranch } from '@/contexts/BranchContext';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Users, Plus, Edit, Trash2, MapPin, Phone, Mail } from 'lucide-react';
import { Branch, Staff } from '@/types';

const BranchManagement = () => {
  const { branches, staff, addBranch, updateBranch, deleteBranch, addStaff, updateStaff, deleteStaff } = useBranch();
  const { hasAdminAccess } = useAuth();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [branchDialogOpen, setBranchDialogOpen] = useState(false);
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);

  const [branchForm, setBranchForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    manager: '',
    isActive: true
  });

  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    role: 'cashier' as 'cashier' | 'salesperson' | 'manager',
    branchId: '',
    phone: '',
    hireDate: new Date().toISOString().split('T')[0],
    isActive: true
  });

  if (!hasAdminAccess()) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <Card>
          <CardContent className="p-6">
            <p>You don't have permission to access branch management.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBranch) {
      updateBranch({ ...selectedBranch, ...branchForm, updatedAt: new Date().toISOString() });
    } else {
      addBranch(branchForm);
    }
    setBranchDialogOpen(false);
    resetBranchForm();
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStaff) {
      updateStaff({ ...selectedStaff, ...staffForm, updatedAt: new Date().toISOString() });
    } else {
      addStaff(staffForm);
    }
    setStaffDialogOpen(false);
    resetStaffForm();
  };

  const resetBranchForm = () => {
    setBranchForm({ name: '', address: '', phone: '', email: '', manager: '', isActive: true });
    setSelectedBranch(null);
  };

  const resetStaffForm = () => {
    setStaffForm({
      name: '',
      email: '',
      role: 'cashier',
      branchId: '',
      phone: '',
      hireDate: new Date().toISOString().split('T')[0],
      isActive: true
    });
    setSelectedStaff(null);
  };

  const editBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setBranchForm({
      name: branch.name,
      address: branch.address,
      phone: branch.phone || '',
      email: branch.email || '',
      manager: branch.manager || '',
      isActive: branch.isActive
    });
    setBranchDialogOpen(true);
  };

  const editStaff = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setStaffForm({
      name: staffMember.name,
      email: staffMember.email,
      role: staffMember.role,
      branchId: staffMember.branchId,
      phone: staffMember.phone || '',
      hireDate: staffMember.hireDate,
      isActive: staffMember.isActive
    });
    setStaffDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Branch Management</h1>
      </div>

      {/* Branch Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Branches
          </CardTitle>
          <Dialog open={branchDialogOpen} onOpenChange={setBranchDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetBranchForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Branch
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedBranch ? 'Edit Branch' : 'Add New Branch'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleBranchSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="branchName">Branch Name</Label>
                  <Input
                    id="branchName"
                    value={branchForm.name}
                    onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="branchAddress">Address</Label>
                  <Textarea
                    id="branchAddress"
                    value={branchForm.address}
                    onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="branchPhone">Phone</Label>
                  <Input
                    id="branchPhone"
                    value={branchForm.phone}
                    onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="branchEmail">Email</Label>
                  <Input
                    id="branchEmail"
                    type="email"
                    value={branchForm.email}
                    onChange={(e) => setBranchForm({ ...branchForm, email: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {selectedBranch ? 'Update Branch' : 'Add Branch'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map((branch) => (
              <Card key={branch.id} className="border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{branch.name}</h3>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost" onClick={() => editBranch(branch)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteBranch(branch.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {branch.address}
                    </div>
                    {branch.phone && (
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {branch.phone}
                      </div>
                    )}
                    {branch.email && (
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {branch.email}
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <Badge variant="secondary">
                      {staff.filter(s => s.branchId === branch.id && s.isActive).length} Staff
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Staff Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Staff Members
          </CardTitle>
          <Dialog open={staffDialogOpen} onOpenChange={setStaffDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetStaffForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedStaff ? 'Edit Staff' : 'Add New Staff'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleStaffSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="staffName">Name</Label>
                  <Input
                    id="staffName"
                    value={staffForm.name}
                    onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="staffEmail">Email</Label>
                  <Input
                    id="staffEmail"
                    type="email"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="staffRole">Role</Label>
                  <Select value={staffForm.role} onValueChange={(value: 'cashier' | 'salesperson' | 'manager') => setStaffForm({ ...staffForm, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cashier">Cashier</SelectItem>
                      <SelectItem value="salesperson">Salesperson</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="staffBranch">Branch</Label>
                  <Select value={staffForm.branchId} onValueChange={(value) => setStaffForm({ ...staffForm, branchId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="staffPhone">Phone</Label>
                  <Input
                    id="staffPhone"
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="hireDate">Hire Date</Label>
                  <Input
                    id="hireDate"
                    type="date"
                    value={staffForm.hireDate}
                    onChange={(e) => setStaffForm({ ...staffForm, hireDate: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {selectedStaff ? 'Update Staff' : 'Add Staff'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => {
                const branch = branches.find(b => b.id === member.branchId);
                return (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{branch?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      <Badge variant={member.isActive ? "default" : "secondary"}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" onClick={() => editStaff(member)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteStaff(member.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchManagement;
