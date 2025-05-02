
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import QRCode from 'react-qr-code';
import { useReactToPrint } from 'react-to-print';
import { toast } from "sonner";

interface BarcodeGeneratorProps {
  productName: string;
  productSku: string;
  productPrice: number;
}

const BarcodeGenerator = ({ productName, productSku, productPrice }: BarcodeGeneratorProps) => {
  const barcodeRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    documentTitle: `Barcode-${productSku}`,
    onPrintError: () => toast.error("Printing failed"),
    contentRef: barcodeRef,
  });

  const handleSaveAsImage = () => {
    // Add implementation later
    toast("Image saving feature coming soon", {
      description: "This functionality will be added in a future update"
    });
  };

  return (
    <Card className="p-4 flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Product Barcode</h3>
      
      <div 
        ref={barcodeRef} 
        className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-300 rounded-lg bg-white"
      >
        <QRCode 
          value={`SKU:${productSku},NAME:${productName},PRICE:${productPrice}`} 
          size={180}
          className="mb-2"
        />
        <p className="text-sm font-medium mt-2">{productSku}</p>
        <p className="text-sm text-gray-500 mt-1">{productName}</p>
        <p className="text-sm font-bold mt-1">₵{productPrice.toFixed(2)}</p>
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={handlePrint}
          className="flex-1"
          variant="outline"
        >
          Print Barcode
        </Button>
        <Button 
          onClick={handleSaveAsImage}
          className="flex-1"
          variant="default"
        >
          Save as Image
        </Button>
      </div>
    </Card>
  );
};

export default BarcodeGenerator;
