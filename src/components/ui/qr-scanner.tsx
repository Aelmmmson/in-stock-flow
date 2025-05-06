
import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';

interface QrScannerProps {
  onResult: (result: string) => void;
  scanning?: boolean;
  constraints?: MediaTrackConstraints;
  className?: string;
  fps?: number;
}

export const QrScanner: React.FC<QrScannerProps> = ({
  onResult,
  scanning = true,
  constraints = { facingMode: 'environment' },
  className = '',
  fps = 10
}) => {
  const scanner = useRef<Html5Qrcode | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scannerContainerRef.current) return;
    
    const elementId = `qr-scanner-${Math.random().toString(36).substring(2, 9)}`;
    scannerContainerRef.current.id = elementId;
    
    // Create instance
    scanner.current = new Html5Qrcode(elementId);
    
    return () => {
      if (scanner.current && scanner.current.getState() === Html5QrcodeScannerState.SCANNING) {
        scanner.current.stop().catch(error => console.error("Error stopping scanner:", error));
      }
      
      scanner.current = null;
    };
  }, []);

  useEffect(() => {
    const startScanner = async () => {
      if (!scanner.current) return;
      
      try {
        if (scanner.current.getState() === Html5QrcodeScannerState.SCANNING) {
          await scanner.current.stop();
        }
        
        await scanner.current.start(
          { facingMode: constraints.facingMode },
          {
            fps,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            onResult(decodedText);
            setError(null);
          },
          (errorMessage) => {
            // This is just for logging errors, not for stopping scanning
            // console.error(errorMessage);
          }
        );
      } catch (err) {
        setError("Camera access denied or not available. Please ensure you've granted camera permissions.");
        console.error("QR Scanner error:", err);
      }
    };

    if (scanning) {
      startScanner();
    } else if (scanner.current && scanner.current.getState() === Html5QrcodeScannerState.SCANNING) {
      scanner.current.stop().catch(error => console.error("Error stopping scanner:", error));
    }

    return () => {
      if (scanner.current && scanner.current.getState() === Html5QrcodeScannerState.SCANNING) {
        scanner.current.stop().catch(error => console.error("Error stopping scanner:", error));
      }
    };
  }, [scanning, constraints.facingMode, fps, onResult]);

  return (
    <div className={`qr-scanner-container relative ${className}`}>
      <div 
        ref={scannerContainerRef} 
        className="w-full h-full min-h-[300px] bg-black rounded-lg overflow-hidden"
      >
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white p-4 text-center">
            <p>{error}</p>
          </div>
        )}
      </div>
      <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-white/30 rounded-md m-8"></div>
    </div>
  );
};
