import React, { useState, useContext, useMemo } from 'react';
import { ChevronLeft, Search, QrCode, Ticket, Info, CheckCircle, ScanLine } from 'lucide-react';
import { DataContext } from '../../context/DataContext';
import { AuthContext } from '../../context/AuthContext';
import { LanguageContext } from '../../context/ThemeContext';
import type { Reservation } from '../../types';
import QrScanner from './QrScanner';

interface ManageReservationsProps {
  onBack: () => void;
}

const ReservationDetailCard: React.FC<{ reservation: Reservation }> = ({ reservation }) => {
    const dataContext = useContext(DataContext);
    const { t } = useContext(LanguageContext)!;

    const foodItem = dataContext?.getFoodItemById(reservation.foodItemId);
    const user = dataContext?.getUserById(reservation.userId);

    if (!foodItem || !user) return null;
    
    const isPickupTimeOver = new Date(foodItem.availableUntil) < new Date();

    return (
        <div className={`p-4 rounded-lg shadow-sm border ${isPickupTimeOver ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 opacity-70' : 'bg-white dark:bg-slate-800 dark:border-slate-700'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-lg text-dark dark:text-light">{foodItem.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('by')}: {user.name}</p>
                </div>
                {isPickupTimeOver && (
                    <div className="text-xs font-semibold px-2 py-1 bg-red-100 text-red-800 rounded-full dark:bg-red-900 dark:text-red-300">{t('timeUp')}</div>
                )}
            </div>
            <div className="mt-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-sm space-y-2">
                <div className="flex justify-between text-dark dark:text-light">
                    <span className="text-gray-600 dark:text-gray-300">{t('reservationDate')}</span>
                    <span className="font-medium">{new Date(reservation.createdAt).toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};


const ManageReservations: React.FC<ManageReservationsProps> = ({ onBack }) => {
  const { t } = useContext(LanguageContext)!;
  const dataContext = useContext(DataContext);
  const authContext = useContext(AuthContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const partnerId = authContext?.currentUser?.id;
  
  const reservations = useMemo(() => {
    if (partnerId) {
        return dataContext?.getReservationsForPartner(partnerId) ?? [];
    }
    return [];
  }, [dataContext, partnerId, dataContext?.reservations]);

  const filteredReservations = useMemo(() => {
    if (!searchTerm) return reservations;
    const lowercasedTerm = searchTerm.toLowerCase();
    return reservations.filter(res => {
        const food = dataContext?.getFoodItemById(res.foodItemId);
        const user = dataContext?.getUserById(res.userId);
        return res.reservationCode.toLowerCase().includes(lowercasedTerm) ||
               food?.name.toLowerCase().includes(lowercasedTerm) ||
               user?.name.toLowerCase().includes(lowercasedTerm);
    });
  }, [reservations, searchTerm, dataContext]);

  const verifyCode = (code: string) => {
    if (!code) return;
    setVerificationStatus(null);
    try {
        dataContext?.completeReservation(code);
        setVerificationStatus({ type: 'success', message: t('alert.verificationSuccess') });
        setVerificationCode('');
    } catch (e: any) {
        setVerificationStatus({ type: 'error', message: t(e.message) || t('alert.verificationError') });
    }
    setTimeout(() => setVerificationStatus(null), 4000);
  };

  const handleVerification = () => {
    verifyCode(verificationCode);
  };

  const handleScanSuccess = (decodedText: string) => {
    setIsScannerOpen(false);
    if (decodedText.startsWith('SAVEFOOD_')) {
        const code = decodedText.substring('SAVEFOOD_'.length);
        setVerificationCode(code); // Set the code in the input for visibility
        verifyCode(code); // And immediately verify
    } else {
        setVerificationStatus({ type: 'error', message: t('invalidQrCode') });
        setTimeout(() => setVerificationStatus(null), 4000);
    }
  };

  return (
    <>
      {isScannerOpen && (
          <QrScanner 
            onScanSuccess={handleScanSuccess}
            onClose={() => setIsScannerOpen(false)}
          />
      )}
      <div className="p-4 space-y-4">
          <div className="flex items-center mb-4">
              <button onClick={onBack} className="p-2 mr-2 text-dark dark:text-light">
                  <ChevronLeft />
              </button>
              <h2 className="text-xl font-bold text-dark dark:text-light">{t('manageReservations')}</h2>
          </div>

          {/* Verification Section */}
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-dark dark:text-light"><QrCode size={20} className="text-primary"/> {t('verifyReservation')}</h3>
              <div className="flex items-stretch gap-2">
                  <input
                      type="text"
                      placeholder={t('enterCode')}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                      className="flex-grow px-4 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                  <button 
                      onClick={() => setIsScannerOpen(true)} 
                      className="p-3 bg-gray-200 text-dark dark:bg-slate-700 dark:text-light rounded-md hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors" 
                      type="button" 
                      aria-label={t('scanQrCode')}
                  >
                      <ScanLine size={20} />
                  </button>
                  <button onClick={handleVerification} className="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-dark transition-colors disabled:bg-gray-400" disabled={!verificationCode}>
                      {t('verify')}
                  </button>
              </div>
              {verificationStatus && (
                  <div className={`mt-3 text-sm p-2 rounded-md flex items-center gap-2 ${verificationStatus.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                      <CheckCircle size={16} />
                      {verificationStatus.message}
                  </div>
              )}
          </div>

          {/* Active Reservations List */}
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-dark dark:text-light"><Ticket size={20} className="text-primary"/> {t('activeReservations')} ({reservations.length})</h3>
              <div className="relative mb-4">
                  <input
                      type="text"
                      placeholder={t('searchReservations')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-full dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>

              {filteredReservations.length > 0 ? (
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                      {filteredReservations.map(res => <ReservationDetailCard key={res.id} reservation={res} />)}
                  </div>
              ) : (
                  <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                      <Info size={32} className="mx-auto mb-2"/>
                      <p className="font-semibold">{t('noActiveReservationsFound')}</p>
                      <p className="text-sm">{t(searchTerm ? 'tryDifferentSearch' : 'newReservationsAppearHere')}</p>
                  </div>
              )}
          </div>
      </div>
    </>
  );
};

export default ManageReservations;