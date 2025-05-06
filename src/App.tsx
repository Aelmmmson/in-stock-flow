
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { InventoryProvider } from "@/contexts/InventoryContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import LoadingScreen from "@/components/common/LoadingScreen";

// Pages
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import ProductBarcode from "./pages/ProductBarcode";
import Transactions from "./pages/Transactions";
import AddTransaction from "./pages/AddTransaction";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import FinancialReports from "./pages/FinancialReports";
import LowStockItems from "./pages/LowStockItems";
import ExpensesPage from "./pages/ExpensesPage";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import TransactionDetail from "./pages/TransactionDetail";
import Profile from "./pages/Profile";
import ReportsInventory from "./pages/ReportsInventory";
import ReportsSales from "./pages/ReportsSales";
import ScanProduct from "./pages/ScanProduct";
import Categories from "./pages/Categories";
import Discounts from "./pages/Discounts";
import Help from "./pages/Help";
import Notifications from "./pages/Notifications";

// Create a new QueryClient instance outside the component
const queryClient = new QueryClient();

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <InventoryProvider>
              {loading ? (
                <LoadingScreen />
              ) : (
                <BrowserRouter>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    {/* Redirect from root to dashboard */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/" element={<AppLayout />}>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="inventory" element={<Inventory />} />
                      <Route path="inventory/:id" element={<ProductDetail />} />
                      <Route path="inventory/:id/edit" element={<EditProduct />} />
                      <Route path="inventory/:id/barcode" element={<ProductBarcode />} />
                      <Route path="inventory/scan/:sku" element={<ScanProduct />} />
                      <Route path="inventory/add" element={<AddProduct />} />
                      <Route path="inventory/categories" element={<Categories />} />
                      <Route path="transactions" element={<Transactions />} />
                      <Route path="transactions/add" element={<AddTransaction />} />
                      <Route path="transactions/:id" element={<TransactionDetail />} />
                      <Route path="reports" element={<Reports />} />
                      <Route path="reports/inventory" element={<ReportsInventory />} />
                      <Route path="reports/sales" element={<ReportsSales />} />
                      <Route path="reports/financial" element={<FinancialReports />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="settings/profile" element={<Profile />} />
                      <Route path="discounts" element={<Discounts />} />
                      <Route path="help" element={<Help />} />
                      <Route path="notifications" element={<Notifications />} />
                      <Route path="low-stock" element={<LowStockItems />} />
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              )}
            </InventoryProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
