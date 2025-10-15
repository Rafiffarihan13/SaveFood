import React, { useContext } from 'react';
import type { Reservation, FoodItem } from '../../types';
import { DataContext } from '../../context/DataContext';
import { CheckCircle, X, Download } from 'lucide-react';
// FIX: Corrected the import path for LanguageContext.
import { LanguageContext } from '../../context/ThemeContext';

// Mock QR Code component
const QRCode: React.FC<{ value: string, id: string }> = ({ value, id }) => (
    <div className="bg-white p-4 border rounded-lg dark:bg-gray-100">
        <img id={id} src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(value)}`} alt="QR Code" crossOrigin="anonymous" />
    </div>
);

interface ReservationConfirmationProps {
  reservation: Reservation;
  foodItem: FoodItem;
  onClose: () => void;
}

const ReservationConfirmation: React.FC<ReservationConfirmationProps> = ({ reservation, foodItem, onClose }) => {
  const dataContext = useContext(DataContext);
  const { t } = useContext(LanguageContext)!;
  const restaurant = dataContext?.getRestaurantById(foodItem.restaurantId);

  const qrCodeId = `qr-code-${reservation.id}`;

  const handleSaveQrCode = () => {
    const qrImage = document.getElementById(qrCodeId) as HTMLImageElement;
    if (!qrImage) return;

    // The image is from a different origin, fetching it again avoids canvas tainting issues.
    fetch(qrImage.src)
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `savefood_reservation_${reservation.reservationCode}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      })
      .catch((e) => {
          console.error('Error saving QR code:', e);
          alert('Could not save QR code.');
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-light dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-dark dark:hover:text-light">
            <X size={24} />
        </button>
        <div className="p-6 text-center">
            <CheckCircle className="text-primary mx-auto mb-4" size={64}/>
            <h2 className="text-2xl font-bold text-dark dark:text-light">{t('reservationSuccessTitle')}</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{t('reservationSuccessBody')}</p>
            
            <div className="my-6 flex flex-col items-center">
                <QRCode value={reservation.qrCodeValue} id={qrCodeId} />
                <button onClick={handleSaveQrCode} className="mt-4 flex items-center justify-center gap-2 text-primary dark:text-green-400 hover:underline font-semibold text-sm">
                    <Download size={16} />
                    {t('saveQrCode')}
                </button>
                <p className="mt-4 text-lg font-semibold text-dark dark:text-light">{t('orShowCode')}</p>
                <p className="text-2xl font-bold tracking-widest bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg mt-2 text-dark dark:text-light">{reservation.reservationCode}</p>
            </div>
            
            <div className="text-left bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                <h3 className="font-bold text-lg mb-2 text-dark dark:text-light">{t('orderDetails')}</h3>
                <p className="text-dark dark:text-light"><strong>{foodItem.name}</strong></p>
                <p className="text-dark dark:text-light">{t('at')} <strong>{restaurant?.name}</strong></p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{restaurant?.address}</p>
            </div>
            
            <button onClick={onClose} className="mt-6 w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors">
              {t('done')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationConfirmation;