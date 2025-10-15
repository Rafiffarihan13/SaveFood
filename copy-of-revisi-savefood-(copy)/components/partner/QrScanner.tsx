import React, { useEffect, useRef, useState, useContext } from 'react';
import { X, CameraOff } from 'lucide-react';
import { LanguageContext } from '../../context/ThemeContext';

declare var Html5Qrcode: any;

interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ onScanSuccess, onClose }) => {
  const { t } = useContext(LanguageContext)!;
  const scannerRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5Qrcode('qr-reader');
    const config = { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 };

    const startScanner = async () => {
      try {
        await scannerRef.current.start(
          { facingMode: 'environment' },
          config,
          (decodedText: string) => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop();
            }
            onScanSuccess(decodedText);
          },
          (errorMessage: string) => {
            // This callback is for continuous scanning, error messages can be ignored.
          }
        );
      } catch (err: any) {
        console.error('QR Scanner Error:', err);
        setError(t('cameraPermissionError') || 'Could not start camera.');
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch((err: any) => {
          console.error('Failed to stop the scanner.', err);
        });
      }
    };
  }, [onScanSuccess, t]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center animate-fade-in">
      <div className="absolute top-4 right-4">
        <button onClick={onClose} className="bg-white/20 backdrop-blur-sm text-white rounded-full p-3 hover:bg-white/30 transition-colors">
          <X size={24} />
        </button>
      </div>
      
      <div className="relative w-full max-w-md aspect-square p-4">
        <div id="qr-reader" className="w-full h-full rounded-lg overflow-hidden"></div>
        
        {error && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center text-white p-4">
                <CameraOff size={48} className="text-red-500 mb-4" />
                <h3 className="font-bold text-lg">{t('cameraErrorTitle')}</h3>
                <p className="text-sm">{error}</p>
            </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[250px] h-[250px] border-4 border-white/50 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                <div className="absolute -top-1 -left-1 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                <div className="absolute -top-1 -right-1 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
            </div>
        </div>
      </div>
      
      <div className="text-center text-white mt-4 p-4">
        <h2 className="text-xl font-bold">{t('scanningTitle')}</h2>
        <p className="text-gray-300">{t('scannerInstructions')}</p>
      </div>
    </div>
  );
};

export default QrScanner;
