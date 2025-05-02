
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InventoryProvider } from "@/contexts/InventoryContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AppLayout from "@/components/layout/AppLayout";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <InventoryProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="inventory/add" element={<AddProduct />} />
                <Route path="inventory/:id/edit" element={<EditProduct />} />
                <Route path="inventory/:id/barcode" element={<ProductBarcode />} />
                <Route path="inventory/low-stock" element={<LowStockItems />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="transactions/add" element={<AddTransaction />} />
                <Route path="reports" element={<Reports />} />
                <Route path="reports/financial" element={<FinancialReports />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </InventoryProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
