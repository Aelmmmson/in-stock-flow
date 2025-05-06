
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QrScanner } from '@/components/ui/qr-scanner';
import { toast } from 'sonner';
import { ScanLine, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface BarcodeScannerProps {
  onScanSuccess?: (result: string) => void;
  onClose?: () => void;
  redirectToProduct?: boolean;
}

const BarcodeScanner = ({ onScanSuccess, onClose, redirectToProduct = false }: BarcodeScannerProps) => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);

  const handleScan = (result: string) => {
    setScanning(false);
    
    if (result) {
      // Extract SKU from the scanned result
      const skuMatch = result.match(/SKU:([^,]+)/);
      const sku = skuMatch ? skuMatch[1] : null;
      
      if (sku) {
        if (redirectToProduct) {
          navigate(`/inventory/scan/${sku}`);
        }
        
        if (onScanSuccess) {
          onScanSuccess(result);
        }
        
        toast.success("Product scanned successfully");
      } else {
        toast.error("Invalid barcode format");
      }
    } else {
      toast.error("Failed to read barcode");
    }
    
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="relative">
      <div className="mb-4">
        <QrScanner
          onResult={handleScan}
          scanning={scanning}
          className="w-full max-w-sm mx-auto aspect-square"
          constraints={{ facingMode: 'environment' }}
        />
      </div>
      
      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Position the barcode or QR code in the center of the camera view
        </p>
        
        <Button
          variant="outline"
          onClick={onClose}
          className="items-center justify-center"
        >
          <X className="mr-2 h-4 w-4" /> Cancel Scan
        </Button>
      </div>
    </div>
  );
};

export const BarcodeScannerDialog = ({ 
  open, 
  onClose, 
  onScanSuccess,
  redirectToProduct = false
}: { 
  open: boolean; 
  onClose: () => void; 
  onScanSuccess?: (result: string) => void;
  redirectToProduct?: boolean;
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Product Barcode</DialogTitle>
        </DialogHeader>
        <BarcodeScanner 
          onScanSuccess={onScanSuccess} 
          onClose={onClose}
          redirectToProduct={redirectToProduct}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeScanner;
