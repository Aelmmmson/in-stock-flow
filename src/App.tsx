
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Login from './pages/Login';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import AddTransaction from './pages/AddTransaction';
import FinancialReports from './pages/FinancialReports';
import ReportsInventory from './pages/ReportsInventory';
import ReportsSales from './pages/ReportsSales';
import Profile from './pages/Profile';
import Help from './pages/Help';
import ExpensesPage from './pages/ExpensesPage';
import BranchManagement from './pages/BranchManagement';
import Discounts from './pages/Discounts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { BranchProvider } from './contexts/BranchContext';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BranchProvider>
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <QueryClientProvider client={queryClient}>
              <InventoryProvider>
                <Toaster />
                <Routes>
                  <Route
                    path="/login"
                    element={
                      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
                        <Login />
                      </div>
                    }
                  />
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
                        <AppLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="inventory/add" element={<AddProduct />} />
                    <Route path="inventory/:id" element={<EditProduct />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="transactions/add" element={<AddTransaction />} />
                    <Route path="transactions/:id" element={<AddTransaction />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="reports/financial" element={<FinancialReports />} />
                    <Route path="reports/inventory" element={<ReportsInventory />} />
                    <Route path="reports/sales" element={<ReportsSales />} />
                    <Route path="expenses" element={<ExpensesPage />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="settings/profile" element={<Profile />} />
                    <Route path="discounts" element={<Discounts />} />
                    <Route path="help" element={<Help />} />
                    <Route path="branch-management" element={<BranchManagement />} />
                  </Route>
                </Routes>
              </InventoryProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </BranchProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
